# Team 1: Settings & AI Engine

## Ownership

Team 1 owns the settings/configuration UI and the AI analysis backend.

### Files owned

- `src/main/**` — all main process code (store, IPC handlers, Mastra agent & tools)
- `src/renderer/src/pages/Setup.tsx`
- `src/renderer/src/components/setup/**`
- `src/renderer/src/hooks/useSettings.ts`

### IPC channels produced

| Channel           | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `settings:get`    | Load persisted LLM settings                         |
| `settings:save`   | Persist LLM settings (encrypts API keys)            |
| `connection:test` | Test LLM connection via Mastra agent                |
| `ai:analyze-code` | Run AI analysis on source code (consumed by Team 2) |
| `ai:analyze-html` | Run AI analysis on HTML (consumed by Team 3)        |

## Development

1. Run `npm run dev` to start the Electron app
2. Navigate to the **Setup** tab to test settings flows
3. The `useSettings` hook provides `getSettings`, `saveSettings`, and `testConnection`
4. When running without Electron (browser dev), `mockIpcApi` provides default responses

## Key implementation notes

- API keys are encrypted with `safeStorage` before being stored via `electron-store`
- The `connection:test` handler creates a Mastra agent and sends a simple prompt
- AI analysis handlers (`ai:analyze-code`, `ai:analyze-html`) are currently stub implementations returning `{ ok: false, error: '...' }`

## Goals

### Goal 1: Implement `ai:analyze-code` IPC handler

Wire the `AI_ANALYZE_CODE` handler in `src/main/ipc-handlers.ts` to call the Mastra `a11y-agent` with the submitted source code. The handler currently returns a stub `{ ok: false, error: '...' }` — it should invoke the agent, parse the response into `AnalyzeCodeResponse` (a list of `CodeFix` items), and return `{ ok: true, data }`. This unblocks Team 2's IDE auditor from showing real AI-suggested fixes.

### Goal 2: Implement `ai:analyze-html` IPC handler

Wire the `AI_ANALYZE_HTML` handler in `src/main/ipc-handlers.ts` to call the Mastra `a11y-agent` with the submitted HTML. Same pattern as Goal 1 — invoke the agent, return `AnalyzeHtmlResponse` (a list of `HtmlFix` items). This unblocks Team 3's browser auditor from showing real AI-suggested fixes.

### Goal 3: Implement the `eslint-tool` Mastra tool

The Mastra tool in `src/main/mastra/tools/eslint-tool.ts` is a placeholder that returns `{ errors: [] }`. Implement it to actually run ESLint with accessibility rules (e.g. `eslint-plugin-jsx-a11y`) against the provided directory and return real `EslintError[]` results.

### Goal 4: Implement the `axe-core-tool` Mastra tool

The Mastra tool in `src/main/mastra/tools/axe-core-tool.ts` is a placeholder that returns `{ violations: [] }`. Implement it to run axe-core against the provided URL (e.g. using Puppeteer or Playwright) and return real `AxeViolation[]` results.
