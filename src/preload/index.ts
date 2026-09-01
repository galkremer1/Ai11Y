import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "../shared/channels";

contextBridge.exposeInMainWorld("api", {
  // Settings (Team 1)
  getSettings: () => ipcRenderer.invoke(IpcChannels.SETTINGS_GET),
  saveSettings: (settings: unknown) =>
    ipcRenderer.invoke(IpcChannels.SETTINGS_SAVE, settings),
  testConnection: (settings: unknown) =>
    ipcRenderer.invoke(IpcChannels.CONNECTION_TEST, settings),
  // Dialogs
  selectDirectory: () => ipcRenderer.invoke(IpcChannels.DIALOG_SELECT_DIR),
  // AI Analysis (Team 1, consumed by Teams 2 & 3)
  analyzeCode: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.AI_ANALYZE_CODE, request),
  analyzeHtml: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.AI_ANALYZE_HTML, request),
  // ESLint (Team 2)
  runEslint: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.ESLINT_RUN, request),
  // File System (Team 2)
  readFileTree: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.FILE_TREE_READ, request),
  readFile: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.FILE_READ, request),
  writeFile: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.FILE_WRITE, request),
  // Axe Audit (Team 3)
  runAxeAudit: (request: unknown) =>
    ipcRenderer.invoke(IpcChannels.AXE_AUDIT, request),
});
