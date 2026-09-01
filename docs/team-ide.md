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
