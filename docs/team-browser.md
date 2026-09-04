# Team 3: Browser Auditor

## Ownership

Team 3 owns the browser auditor page — URL input, empathy viewer, Axe violations, and HTML code fix display.

### Files owned

- `src/renderer/src/pages/BrowserAuditor.tsx`
- `src/renderer/src/components/browser/**`
- `src/renderer/src/hooks/useBrowserServices.ts`

### IPC channels consumed

| Channel           | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `axe:audit`       | Run Axe-Core accessibility audit against a URL           |
| `ai:analyze-html` | Request AI fix suggestions for HTML (produced by Team 1) |

## Development

1. Run `npm run dev` to start the Electron app
2. Navigate to the **Browser Auditor** tab
3. The `useBrowserServices` hook provides `runAxeAudit` and `analyzeHtml`
4. Mock data (`mockAxeViolations`) is loaded from `@shared/mocks/`

## Key implementation notes

- The empathy viewer applies CSS filters to simulate vision impairments (protanopia, deuteranopia, etc.)
- Axe violations display in the `AxeViolations` component using `AxeViolation[]` from `@shared/schemas/axe.schemas`
- The `CodeFix` component shows original vs. fixed HTML side-by-side
- The Audit button is not yet wired — connect it to `runAxeAudit` when ready

## Goals

### Goal 1: Wire the Audit button to real axe-core results

The Audit button in `BrowserAuditor.tsx` has no `onClick` handler and the `AxeViolations` component is fed `mockAxeViolations`. Wire the button to call `useBrowserServices().runAxeAudit` with the entered URL, and display the real `AxeViolation[]` results. Depends on Team 1 implementing the `axe-core-tool` Mastra tool (Team 1 Goal 4).

### Goal 2: Render the audited page in EmpathyViewer

The `EmpathyViewer` is a static placeholder (skeleton wireframe). Embed the user-provided URL in a `<webview>` or `<iframe>` so the page actually renders, then apply the CSS vision-impairment filters on top of the live content.

### Goal 3: Wire AI HTML fix with real data

The `CodeFix` component shows hardcoded `fixOriginal` / `fixFixed` HTML strings. After an audit completes, let the user select a violation and call `useBrowserServices().analyzeHtml` to get an AI-suggested fix. Display the original vs. fixed HTML in the CodeFix component. Depends on Team 1 implementing `ai:analyze-html` (Team 1 Goal 2).

### Goal 4: Implement screen reader simulation

The Screen Reader toggle in `EmpathyControls` updates state but has no real behavior. Implement a basic screen reader simulation — e.g. extract and display the page's accessibility tree, or read through ARIA landmarks and text content in order.
