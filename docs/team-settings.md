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
