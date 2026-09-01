import { ipcMain, dialog, BrowserWindow } from "electron";
import { getSettings, saveSettings } from "./store";
import { getA11yAgent } from "./mastra/agents/a11y-agent";
import { IpcChannels } from "../shared/channels";

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

  // AI Analysis — stub handlers (Team 1 will implement)
  ipcMain.handle(IpcChannels.AI_ANALYZE_CODE, async (_event, _request) => {
    return { ok: false, error: "AI code analysis not yet implemented" };
  });

  ipcMain.handle(IpcChannels.AI_ANALYZE_HTML, async (_event, _request) => {
    return { ok: false, error: "AI HTML analysis not yet implemented" };
  });

  // ESLint — stub handler (Team 2 will implement)
  ipcMain.handle(IpcChannels.ESLINT_RUN, async (_event, _request) => {
    return { ok: false, error: "ESLint runner not yet implemented" };
  });

  // File System — stub handlers (Team 2 will implement)
  ipcMain.handle(IpcChannels.FILE_TREE_READ, async (_event, _request) => {
    return { ok: false, error: "File tree reader not yet implemented" };
  });

  ipcMain.handle(IpcChannels.FILE_READ, async (_event, _request) => {
    return { ok: false, error: "File reader not yet implemented" };
  });

  ipcMain.handle(IpcChannels.FILE_WRITE, async (_event, _request) => {
    return { ok: false, error: "File writer not yet implemented" };
  });

  // Axe Audit — stub handler (Team 3 will implement)
  ipcMain.handle(IpcChannels.AXE_AUDIT, async (_event, _request) => {
    return { ok: false, error: "Axe audit not yet implemented" };
  });
}
