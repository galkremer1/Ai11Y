import type { IpcApi } from "../types/ipc-api";
import type { ServiceResult } from "../schemas/common.schemas";
import { defaultSettings } from "./mock-settings";
import { mockEslintErrors } from "./mock-eslint";
import { mockAxeViolations } from "./mock-axe";
import {
  mockAnalyzeCodeResponse,
  mockAnalyzeHtmlResponse,
} from "./mock-ai-responses";
import type { LLMSettings } from "../schemas/settings.schemas";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let storedSettings: LLMSettings = { ...defaultSettings };

export const mockIpcApi: IpcApi = {
  async getSettings() {
    await delay(100);
    return { ...storedSettings };
  },

  async saveSettings(settings) {
    await delay(200);
    storedSettings = { ...settings };
  },

  async testConnection(_settings) {
    await delay(800);
    return { ok: true, message: "Connected. Response: ok" };
  },

  async selectDirectory() {
    await delay(100);
    return "/mock/project/directory";
  },

  async analyzeCode(_request) {
    await delay(1000);
    return { ok: true, data: mockAnalyzeCodeResponse };
  },

  async analyzeHtml(_request) {
    await delay(1000);
    return { ok: true, data: mockAnalyzeHtmlResponse };
  },

  async runEslint(_request) {
    await delay(500);
    return { ok: true, data: { errors: mockEslintErrors } };
  },

  async readFileTree(_request) {
    await delay(300);
    return {
      ok: true,
      data: {
        root: {
          name: "project",
          path: "/mock/project/directory",
          type: "directory",
          children: [
            {
              name: "src",
              path: "/mock/project/directory/src",
              type: "directory",
              children: [
                {
                  name: "components",
                  path: "/mock/project/directory/src/components",
                  type: "directory",
                  children: [
                    {
                      name: "LoginForm.tsx",
                      path: "/mock/project/directory/src/components/LoginForm.tsx",
                      type: "file",
                    },
                    {
                      name: "NavBar.tsx",
                      path: "/mock/project/directory/src/components/NavBar.tsx",
                      type: "file",
                    },
                  ],
                },
                {
                  name: "App.tsx",
                  path: "/mock/project/directory/src/App.tsx",
                  type: "file",
                },
              ],
            },
            {
              name: "package.json",
              path: "/mock/project/directory/package.json",
              type: "file",
            },
          ],
        },
      },
    };
  },

  async readFile(_request) {
    await delay(200);
    return {
      ok: true,
      data: {
        content: "// Mock file content",
        filePath: _request.filePath,
      },
    };
  },

  async writeFile(_request) {
    await delay(200);
    return { ok: true, data: undefined } as ServiceResult<void>;
  },

  async runAxeAudit(_request) {
    await delay(800);
    return { ok: true, data: { violations: mockAxeViolations } };
  },
};
