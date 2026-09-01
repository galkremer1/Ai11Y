# Adding a New IPC Channel

Follow these steps when adding a new IPC channel to ai11y.

## 1. Define the schema

Create or update a schema file in `src/shared/schemas/`. Define Zod schemas for the request and response types.

```typescript
// src/shared/schemas/example.schemas.ts
import { z } from "zod";

export const ExampleRequestSchema = z.object({
  input: z.string(),
});
export type ExampleRequest = z.infer<typeof ExampleRequestSchema>;

export const ExampleResponseSchema = z.object({
  output: z.string(),
});
export type ExampleResponse = z.infer<typeof ExampleResponseSchema>;
```

## 2. Add the channel constant

Add the channel name to `src/shared/channels.ts`:

```typescript
export const IpcChannels = {
  // ... existing channels
  EXAMPLE_RUN: "example:run",
} as const;
```

## 3. Update the IpcApi interface

Add the method to `src/shared/types/ipc-api.ts`:

```typescript
export interface IpcApi {
  // ... existing methods
  runExample(request: ExampleRequest): Promise<ServiceResult<ExampleResponse>>;
}
```

## 4. Add the barrel export

Export the new types from `src/shared/index.ts`.

## 5. Update the preload script

Add the bridge in `src/preload/index.ts`:

```typescript
runExample: (request: unknown) => ipcRenderer.invoke(IpcChannels.EXAMPLE_RUN, request),
```

## 6. Add the main process handler

Add a handler in `src/main/ipc-handlers.ts`:

```typescript
ipcMain.handle(IpcChannels.EXAMPLE_RUN, async (_event, request) => {
  try {
    // implementation
    return { ok: true, data: { output: "..." } };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
});
```

## 7. Add mock data

Add mock response data to `src/shared/mocks/` and update `mock-ipc-api.ts`:

```typescript
async runExample(_request) {
  await delay(300)
  return { ok: true, data: { output: 'mock output' } }
},
```

Also update `mock-ipc-handlers.ts` with the new channel.

## 8. Add to the appropriate domain hook

Add the method to the relevant hook (`useSettings`, `useIdeServices`, or `useBrowserServices`):

```typescript
const runExample = useCallback(
  (request: ExampleRequest) => api.runExample(request),
  [api],
);
```

## 9. Run typecheck

```bash
npm run typecheck
```

Both `tsconfig.node.json` and `tsconfig.web.json` must pass.
