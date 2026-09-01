# ai11y Architecture

## System Overview

ai11y is an Electron desktop app for AI-powered accessibility auditing. It has three main sections, each owned by a different team.

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Store    │  │   IPC    │  │   Mastra AI Agent    │  │
│  │(settings)│  │ Handlers │  │  (eslint/axe tools)  │  │
│  └──────────┘  └────┬─────┘  └──────────────────────┘  │
│                     │                                   │
├─────────────────────┼───────────────────────────────────┤
│              Preload│(contextBridge)                    │
├─────────────────────┼───────────────────────────────────┤
│                     │                                   │
│  ┌──────────────────▼──────────────────────────────┐   │
│  │              Renderer Process                    │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │          ApiProvider (React Context)     │    │   │
│  │  │  api = window.api ?? mockIpcApi          │    │   │
│  │  └────────┬──────────┬──────────┬──────────┘    │   │
│  │           │          │          │                │   │
│  │  ┌────────▼──┐ ┌─────▼────┐ ┌──▼──────────┐   │   │
│  │  │useSettings│ │useIdeSvc │ │useBrowserSvc│    │   │
│  │  │ (Team 1)  │ │ (Team 2) │ │  (Team 3)   │    │   │
│  │  └────────┬──┘ └─────┬────┘ └──┬──────────┘   │   │
│  │           │          │          │                │   │
│  │  ┌────────▼──┐ ┌─────▼────┐ ┌──▼──────────┐   │   │
│  │  │  Setup    │ │IDE       │ │Browser      │    │   │
│  │  │  Page     │ │Auditor   │ │Auditor      │    │   │
│  │  └──────────┘ └──────────┘ └─────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                    Renderer Process                     │
└─────────────────────────────────────────────────────────┘
```

## IPC Boundary

All communication between renderer and main process flows through the `IpcApi` interface defined in `src/shared/types/ipc-api.ts`. The preload script bridges these using `ipcRenderer.invoke()` for each channel defined in `src/shared/channels.ts`.

### Data flow

1. Component calls a domain hook (e.g., `useSettings().getSettings()`)
2. Hook delegates to `api.getSettings()` from the `ApiProvider` context
3. In Electron: `window.api.getSettings()` calls `ipcRenderer.invoke('settings:get')`
4. Main process handler in `src/main/ipc-handlers.ts` processes the request
5. Response flows back through the same path

### New IPC responses

All new IPC methods (added after the initial four) return a `ServiceResult<T>` envelope:

```typescript
type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };
```

This provides consistent error handling across all teams.

## Mock Swap Pattern

The `ApiProvider` in `src/renderer/src/main.tsx` selects the API implementation:

```typescript
const api: IpcApi = window.api ?? mockIpcApi;
```

- **In Electron**: `window.api` is defined by the preload script, so real IPC is used.
- **In a browser / dev server without Electron**: `window.api` is `undefined`, so `mockIpcApi` is used.

This enables teams to develop and test their UI components without a running Electron main process.

## Shared Contract Layer

All types, schemas, channel constants, and mocks live in `src/shared/`. This directory is included in both `tsconfig.node.json` (main/preload) and `tsconfig.web.json` (renderer), and aliased as `@shared` in the Vite config.

No team should modify files in `src/shared/` without discussion — see [contracts.md](./contracts.md).
