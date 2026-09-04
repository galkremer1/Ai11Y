# Team 2: IDE / Code Editor

## Ownership

Team 2 owns the IDE auditor page — file tree, code editor, diff viewer, and ESLint integration.

### Files owned

- `src/renderer/src/pages/IDEAuditor.tsx`
- `src/renderer/src/components/ide/**`
- `src/renderer/src/hooks/useIdeServices.ts`

### IPC channels consumed

| Channel                  | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `dialog:selectDirectory` | Open native directory picker                             |
| `eslint:run`             | Run ESLint a11y rules against a directory                |
| `file:read`              | Read a file's contents                                   |
| `file:write`             | Write content to a file                                  |
| `filetree:read`          | Read a directory tree                                    |
| `ai:analyze-code`        | Request AI fix suggestions for code (produced by Team 1) |

## Development

1. Run `npm run dev` to start the Electron app
2. Navigate to the **IDE Auditor** tab
3. The `useIdeServices` hook provides `selectDirectory`, `runEslint`, `analyzeCode`, `readFileTree`, `readFile`, and `writeFile`
4. Mock data (`mockEslintErrors`, `originalCode`/`fixedCode`) is loaded from `@shared/mocks/`

## Key implementation notes

- The file tree component (`FileTree.tsx`) currently uses hardcoded mock data — wire it to `readFileTree` when ready
- The code editor uses Monaco Editor (`@monaco-editor/react`)
- The diff viewer shows original vs. AI-fixed code side-by-side
- ESLint errors display in the `A11yConsole` component using `EslintError[]` from `@shared/schemas/eslint.schemas`

## Goals

### Goal 1: Wire the FileTree to real filesystem data

The `FileTree` component in `src/renderer/src/components/ide/FileTree.tsx` uses a hardcoded `mockTree` constant. Replace it with a call to `useIdeServices().readFileTree` so that after the user picks a directory via `selectDirectory`, the tree reflects the actual filesystem contents.

### Goal 2: Wire ESLint audit to real results

The `A11yConsole` in `IDEAuditor.tsx` is fed `mockEslintErrors` directly. Wire the "Run Audit" flow to call `useIdeServices().runEslint` against the selected directory, and display the real `EslintError[]` results in the console. Depends on Team 1 implementing the `eslint-tool` Mastra tool (Team 1 Goal 3).

### Goal 3: Load files from disk into the editor

The Monaco editor currently shows `originalCode` / `fixedCode` from `mock-sample-code`. When a user clicks a file in the FileTree, call `useIdeServices().readFile` to load the file content into the editor.

### Goal 4: Wire AI code fix and display in DiffViewer

After ESLint errors are shown, let the user request an AI fix. Call `useIdeServices().analyzeCode` with the file content, then display the original vs. AI-fixed code in the `DiffViewer`. Depends on Team 1 implementing `ai:analyze-code` (Team 1 Goal 1).

### Goal 5: Enable saving fixed files

Wire the "Apply Fix" action to call `useIdeServices().writeFile` so that accepted AI fixes are written back to disk.
