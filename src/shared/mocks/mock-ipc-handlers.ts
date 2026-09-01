import { IpcChannels } from "../channels";
import { defaultSettings } from "./mock-settings";
import { mockEslintErrors } from "./mock-eslint";
import { mockAxeViolations } from "./mock-axe";
import {
  mockAnalyzeCodeResponse,
  mockAnalyzeHtmlResponse,
} from "./mock-ai-responses";
import type { LLMSettings } from "../schemas/settings.schemas";

let storedSettings: LLMSettings = { ...defaultSettings };

type HandlerFn = (_event: unknown, ...args: unknown[]) => unknown;

export const mockIpcHandlers: Record<string, HandlerFn> = {
  [IpcChannels.SETTINGS_GET]: async () => {
    return { ...storedSettings };
  },

  [IpcChannels.SETTINGS_SAVE]: async (_event, settings) => {
    storedSettings = settings as LLMSettings;
  },

  [IpcChannels.CONNECTION_TEST]: async () => {
    return { ok: true, message: "Connected. Response: ok" };
  },

  [IpcChannels.DIALOG_SELECT_DIR]: async () => {
    return "/mock/project/directory";
  },

  [IpcChannels.AI_ANALYZE_CODE]: async () => {
    return { ok: true, data: mockAnalyzeCodeResponse };
  },

  [IpcChannels.AI_ANALYZE_HTML]: async () => {
    return { ok: true, data: mockAnalyzeHtmlResponse };
  },

  [IpcChannels.ESLINT_RUN]: async () => {
    return { ok: true, data: { errors: mockEslintErrors } };
  },

  [IpcChannels.FILE_TREE_READ]: async () => {
    return {
      ok: true,
      data: {
        root: {
          name: "project",
          path: "/mock/project/directory",
          type: "directory",
          children: [],
        },
      },
    };
  },

  [IpcChannels.FILE_READ]: async () => {
    return {
      ok: true,
      data: { content: "// Mock file content", filePath: "/mock/file.ts" },
    };
  },

  [IpcChannels.FILE_WRITE]: async () => {
    return { ok: true, data: undefined };
  },

  [IpcChannels.AXE_AUDIT]: async () => {
    return { ok: true, data: { violations: mockAxeViolations } };
  },
};
