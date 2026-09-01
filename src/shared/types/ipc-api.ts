import type { ServiceResult } from "../schemas/common.schemas";
import type {
  LLMSettings,
  ConnectionTestResult,
} from "../schemas/settings.schemas";
import type {
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
} from "../schemas/ai-analysis.schemas";
import type {
  AnalyzeHtmlRequest,
  AnalyzeHtmlResponse,
} from "../schemas/ai-analysis.schemas";
import type {
  EslintRunRequest,
  EslintRunResponse,
} from "../schemas/eslint.schemas";
import type {
  FileTreeRequest,
  FileTreeResponse,
} from "../schemas/filesystem.schemas";
import type {
  FileReadRequest,
  FileReadResponse,
} from "../schemas/filesystem.schemas";
import type { FileWriteRequest } from "../schemas/filesystem.schemas";
import type { AxeAuditRequest, AxeAuditResponse } from "../schemas/axe.schemas";

export interface IpcApi {
  // Settings (Team 1 owns)
  getSettings(): Promise<LLMSettings>;
  saveSettings(settings: LLMSettings): Promise<void>;
  testConnection(settings: LLMSettings): Promise<ConnectionTestResult>;
  // Dialogs
  selectDirectory(): Promise<string | null>;
  // AI Analysis (Team 1 owns, Teams 2 & 3 consume)
  analyzeCode(
    request: AnalyzeCodeRequest,
  ): Promise<ServiceResult<AnalyzeCodeResponse>>;
  analyzeHtml(
    request: AnalyzeHtmlRequest,
  ): Promise<ServiceResult<AnalyzeHtmlResponse>>;
  // ESLint (Team 2)
  runEslint(
    request: EslintRunRequest,
  ): Promise<ServiceResult<EslintRunResponse>>;
  // File System (Team 2)
  readFileTree(
    request: FileTreeRequest,
  ): Promise<ServiceResult<FileTreeResponse>>;
  readFile(request: FileReadRequest): Promise<ServiceResult<FileReadResponse>>;
  writeFile(request: FileWriteRequest): Promise<ServiceResult<void>>;
  // Axe Audit (Team 3)
  runAxeAudit(
    request: AxeAuditRequest,
  ): Promise<ServiceResult<AxeAuditResponse>>;
}

declare global {
  interface Window {
    api: IpcApi;
  }
}
