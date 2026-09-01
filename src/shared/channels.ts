export const IpcChannels = {
  // Team 1: Settings
  SETTINGS_GET: "settings:get",
  SETTINGS_SAVE: "settings:save",
  CONNECTION_TEST: "connection:test",
  // Team 1: AI Analysis (consumed by Teams 2 & 3)
  AI_ANALYZE_CODE: "ai:analyze-code",
  AI_ANALYZE_HTML: "ai:analyze-html",
  // Team 2: IDE / Code
  DIALOG_SELECT_DIR: "dialog:selectDirectory",
  ESLINT_RUN: "eslint:run",
  FILE_TREE_READ: "filetree:read",
  FILE_READ: "file:read",
  FILE_WRITE: "file:write",
  // Team 3: Browser / Axe
  AXE_AUDIT: "axe:audit",
} as const;

export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels];
