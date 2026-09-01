// Channel constants
export { IpcChannels, type IpcChannel } from "./channels";

// Common schemas
export {
  serviceResultSchema,
  type ServiceResult,
} from "./schemas/common.schemas";

// Settings schemas
export {
  LLMModeSchema,
  CloudProviderSchema,
  LLMSettingsSchema,
  ConnectionTestResultSchema,
  type LLMMode,
  type CloudProvider,
  type LLMSettings,
  type ConnectionTestResult,
} from "./schemas/settings.schemas";

// ESLint schemas
export {
  EslintErrorSchema,
  EslintRunRequestSchema,
  EslintRunResponseSchema,
  type EslintError,
  type EslintRunRequest,
  type EslintRunResponse,
} from "./schemas/eslint.schemas";

// Axe schemas
export {
  AxeNodeSchema,
  AxeViolationSchema,
  AxeAuditRequestSchema,
  AxeAuditResponseSchema,
  type AxeViolation,
  type AxeAuditRequest,
  type AxeAuditResponse,
} from "./schemas/axe.schemas";

// AI Analysis schemas
export {
  CodeFixSchema,
  AnalyzeCodeRequestSchema,
  AnalyzeCodeResponseSchema,
  HtmlFixSchema,
  AnalyzeHtmlRequestSchema,
  AnalyzeHtmlResponseSchema,
  type CodeFix,
  type AnalyzeCodeRequest,
  type AnalyzeCodeResponse,
  type HtmlFix,
  type AnalyzeHtmlRequest,
  type AnalyzeHtmlResponse,
} from "./schemas/ai-analysis.schemas";

// Filesystem schemas
export {
  FileTreeNodeSchema,
  FileTreeRequestSchema,
  FileTreeResponseSchema,
  FileReadRequestSchema,
  FileReadResponseSchema,
  FileWriteRequestSchema,
  type FileTreeNode,
  type FileTreeRequest,
  type FileTreeResponse,
  type FileReadRequest,
  type FileReadResponse,
  type FileWriteRequest,
} from "./schemas/filesystem.schemas";

// IPC API type
export type { IpcApi } from "./types/ipc-api";
