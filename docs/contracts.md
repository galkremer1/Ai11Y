# IPC Contracts Reference

## Rules

1. All IPC channel names are defined in `src/shared/channels.ts`. Never use string literals.
2. All request/response types are defined as Zod schemas in `src/shared/schemas/`. Never inline schemas.
3. New IPC methods must return `ServiceResult<T>` (see `common.schemas.ts`).
4. Changes to `src/shared/` require agreement from all teams before merging.
5. The `IpcApi` interface in `src/shared/types/ipc-api.ts` is the single source of truth for the renderer-main boundary.

## IPC Channel Table

| Channel                  | Constant            | Direction       | Owner  | Request Type         | Response Type                        |
| ------------------------ | ------------------- | --------------- | ------ | -------------------- | ------------------------------------ |
| `settings:get`           | `SETTINGS_GET`      | renderer → main | Team 1 | —                    | `LLMSettings`                        |
| `settings:save`          | `SETTINGS_SAVE`     | renderer → main | Team 1 | `LLMSettings`        | `void`                               |
| `connection:test`        | `CONNECTION_TEST`   | renderer → main | Team 1 | `LLMSettings`        | `ConnectionTestResult`               |
| `ai:analyze-code`        | `AI_ANALYZE_CODE`   | renderer → main | Team 1 | `AnalyzeCodeRequest` | `ServiceResult<AnalyzeCodeResponse>` |
| `ai:analyze-html`        | `AI_ANALYZE_HTML`   | renderer → main | Team 1 | `AnalyzeHtmlRequest` | `ServiceResult<AnalyzeHtmlResponse>` |
| `dialog:selectDirectory` | `DIALOG_SELECT_DIR` | renderer → main | Team 2 | —                    | `string \| null`                     |
| `eslint:run`             | `ESLINT_RUN`        | renderer → main | Team 2 | `EslintRunRequest`   | `ServiceResult<EslintRunResponse>`   |
| `filetree:read`          | `FILE_TREE_READ`    | renderer → main | Team 2 | `FileTreeRequest`    | `ServiceResult<FileTreeResponse>`    |
| `file:read`              | `FILE_READ`         | renderer → main | Team 2 | `FileReadRequest`    | `ServiceResult<FileReadResponse>`    |
| `file:write`             | `FILE_WRITE`        | renderer → main | Team 2 | `FileWriteRequest`   | `ServiceResult<void>`                |
| `axe:audit`              | `AXE_AUDIT`         | renderer → main | Team 3 | `AxeAuditRequest`    | `ServiceResult<AxeAuditResponse>`    |

## Schema Files

| File                     | Types Exported                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `common.schemas.ts`      | `ServiceResult<T>`, `serviceResultSchema()`                                                |
| `settings.schemas.ts`    | `LLMMode`, `CloudProvider`, `LLMSettings`, `ConnectionTestResult`                          |
| `eslint.schemas.ts`      | `EslintError`, `EslintRunRequest`, `EslintRunResponse`                                     |
| `axe.schemas.ts`         | `AxeViolation`, `AxeAuditRequest`, `AxeAuditResponse`                                      |
| `ai-analysis.schemas.ts` | `CodeFix`, `HtmlFix`, `AnalyzeCodeRequest/Response`, `AnalyzeHtmlRequest/Response`         |
| `filesystem.schemas.ts`  | `FileTreeNode`, `FileTreeRequest/Response`, `FileReadRequest/Response`, `FileWriteRequest` |

## Mock Files

| File                   | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `mock-settings.ts`     | `defaultSettings` — default LLM configuration                     |
| `mock-eslint.ts`       | `mockEslintErrors` — sample ESLint a11y errors                    |
| `mock-axe.ts`          | `mockAxeViolations` — sample Axe-Core violations                  |
| `mock-sample-code.ts`  | `originalCode` / `fixedCode` — before/after code samples          |
| `mock-ai-responses.ts` | `mockAnalyzeCodeResponse` / `mockAnalyzeHtmlResponse`             |
| `mock-ipc-api.ts`      | `mockIpcApi` — full `IpcApi` implementation with simulated delays |
| `mock-ipc-handlers.ts` | `mockIpcHandlers` — handler map for development without Electron  |
