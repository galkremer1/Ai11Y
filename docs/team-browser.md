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
