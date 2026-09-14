import { ipcMain, dialog, BrowserWindow, webContents } from "electron";
import { getSettings, saveSettings } from "./store";
import { getA11yAgentFromSettings } from "./mastra/agents/a11y-agent";
import { IpcChannels } from "../shared/channels";
import {
  FileTreeRequestSchema,
  FileReadRequestSchema,
  FileWriteRequestSchema,
} from "../shared/schemas/filesystem.schemas";
import { EslintRunRequestSchema } from "../shared/schemas/eslint.schemas";
import {
  AnalyzeCodeRequestSchema,
  AnalyzeHtmlRequestSchema,
} from "../shared/schemas/ai-analysis.schemas";
import { LLMSettingsSchema } from "../shared/schemas/settings.schemas";
import {
  readDirectoryTree,
  readFileContent,
  writeFileContent,
} from "./filesystem";
import { runEslintAudit } from "./mastra/tools/eslint-tool";
import {
  analyzeCodeWithAgent,
  analyzeHtmlWithAgent,
} from "./ai-analysis";
import { runAxeAudit } from "./axe-audit";
import { AxeAuditRequestSchema } from "../shared/schemas/axe.schemas";
import {
  listOllamaModels,
  modelIsInstalled,
  normalizeOllamaBaseURL,
} from "./ollama";
import screenReaderScript from "./screen-reader-inject.js?raw";

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.SETTINGS_GET, () => {
    return getSettings();
  });

  ipcMain.handle(IpcChannels.SETTINGS_SAVE, async (_event, settings) => {
    await saveSettings(settings);
  });

  ipcMain.handle(IpcChannels.CONNECTION_TEST, async (_event, settings) => {
    try {
      const parsed = LLMSettingsSchema.parse(settings);

      if (parsed.mode === "local") {
        const baseURL = normalizeOllamaBaseURL(parsed.local.baseURL);
        const installed = await listOllamaModels(baseURL);
        if (!modelIsInstalled(parsed.local.modelName, installed)) {
          const sample = installed.slice(0, 8);
          return {
            ok: false,
            message: `Ollama is running, but model "${parsed.local.modelName}" is not pulled.`,
            availableModels: sample,
          };
        }
      }

      const agent = getA11yAgentFromSettings(parsed);
      const result = await agent.generate(
        'Respond with "ok" and nothing else.',
      );
      return { ok: true, message: `Connected. Response: ${result.text}` };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, message };
    }
  });

  ipcMain.handle(IpcChannels.DIALOG_SELECT_DIR, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle(IpcChannels.AI_ANALYZE_CODE, async (_event, request) => {
    try {
      const parsed = AnalyzeCodeRequestSchema.parse(request);
      const data = await analyzeCodeWithAgent(parsed);
      return { ok: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.AI_ANALYZE_HTML, async (_event, request) => {
    try {
      const parsed = AnalyzeHtmlRequestSchema.parse(request);
      const data = await analyzeHtmlWithAgent(parsed);
      return { ok: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.ESLINT_RUN, async (_event, request) => {
    try {
      const { directory } = EslintRunRequestSchema.parse(request);
      const errors = await runEslintAudit(directory);
      return { ok: true, data: { errors } };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.FILE_TREE_READ, async (_event, request) => {
    try {
      const { directory } = FileTreeRequestSchema.parse(request);
      const root = await readDirectoryTree(directory);
      return { ok: true, data: { root } };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.FILE_READ, async (_event, request) => {
    try {
      const { filePath } = FileReadRequestSchema.parse(request);
      const content = await readFileContent(filePath);
      return { ok: true, data: { content, filePath } };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.FILE_WRITE, async (_event, request) => {
    try {
      const { filePath, content } = FileWriteRequestSchema.parse(request);
      await writeFileContent(filePath, content);
      return { ok: true, data: undefined };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  ipcMain.handle(IpcChannels.AXE_AUDIT, async (_event, request) => {
    try {
      const { url } = AxeAuditRequestSchema.parse(request);
      const violations = await runAxeAudit(url);
      return { ok: true, data: { violations } };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  });

  // Screen Reader — inject focus-listener into the audited page iframe or webview
  ipcMain.handle(IpcChannels.SCREEN_READER_INJECT, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const mainFrame = win.webContents.mainFrame;
      for (const frame of mainFrame.frames) {
        if (frame.url.startsWith("http")) {
          await frame.executeJavaScript(screenReaderScript);
        }
      }
    }

    for (const contents of webContents.getAllWebContents()) {
      if (
        contents.getType() === "webview" &&
        contents.getURL().startsWith("http")
      ) {
        await contents.executeJavaScript(screenReaderScript);
      }
    }
  });
}