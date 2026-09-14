import { ipcMain, dialog, BrowserWindow } from "electron";
import { getSettings, saveSettings } from "./store";
import { getA11yAgent } from "./mastra/agents/a11y-agent";
import { IpcChannels } from "../shared/channels";
import {
  FileTreeRequestSchema,
  FileReadRequestSchema,
  FileWriteRequestSchema,
} from "../shared/schemas/filesystem.schemas";
import { EslintRunRequestSchema } from "../shared/schemas/eslint.schemas";
import { AnalyzeCodeRequestSchema } from "../shared/schemas/ai-analysis.schemas";
import {
  readDirectoryTree,
  readFileContent,
  writeFileContent,
} from "./filesystem";
import { runEslintAudit } from "./mastra/tools/eslint-tool";
import { analyzeCodeWithAgent } from "./ai-analysis";

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.SETTINGS_GET, () => {
    return getSettings();
  });

  ipcMain.handle(IpcChannels.SETTINGS_SAVE, async (_event, settings) => {
    await saveSettings(settings);
  });

  ipcMain.handle(IpcChannels.CONNECTION_TEST, async (_event, settings) => {
    try {
      const agent = getA11yAgent({
        mode: settings.mode,
        apiKey: settings.cloud?.apiKey,
        baseURL:
          settings.mode === "cloud"
            ? settings.cloud?.baseURL
            : settings.local?.baseURL,
        modelName:
          settings.mode === "cloud"
            ? settings.cloud?.modelName
            : settings.local?.modelName,
      });
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

  ipcMain.handle(IpcChannels.AI_ANALYZE_HTML, async (_event, _request) => {
    return { ok: false, error: "AI HTML analysis not yet implemented" };
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

  ipcMain.handle(IpcChannels.AXE_AUDIT, async (_event, _request) => {
    return { ok: false, error: "Axe audit not yet implemented" };
  });
}
