import type { Page } from "../components/layout/Sidebar";

export interface TourStep {
  id: string;
  page: Page;
  selector: string | null;
  title: string;
  body: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    page: "setup",
    selector: null,
    title: "Welcome to ai11y",
    body: "This tour walks through Setup, the IDE Auditor, and the Browser Auditor. You can click the real controls while the coach marks are open. AI Fix steps need a working LLM (local Ollama or a cloud key).",
  },
  {
    id: "setup-mode",
    page: "setup",
    selector: '[data-tour="setup-mode"]',
    title: "Choose where models run",
    body: "Switch between a local Ollama instance and a cloud provider. Local is best for an offline demo.",
    position: "right",
  },
  {
    id: "setup-connection",
    page: "setup",
    selector: '[data-tour="setup-test"]',
    title: "Test the model",
    body: "Save settings, then test the connection. For Ollama you can use http://localhost:11434 — the app adds /v1 automatically. The model name must match `ollama list`.",
    position: "top",
  },
  {
    id: "nav-ide",
    page: "setup",
    selector: "#tour-nav-ide",
    title: "IDE Auditor",
    body: "Open a local project, run jsx-a11y lint, and request an AI code fix.",
    position: "right",
  },
  {
    id: "ide-select-dir",
    page: "ide",
    selector: '[data-tour="ide-select-dir"]',
    title: "Open a project",
    body: "A sample LoginForm is already open in the editor, with NavBar and ImageCard in the tree. Select Directory if you want to audit your own files instead.",
    position: "bottom",
  },
  {
    id: "ide-run-audit",
    page: "ide",
    selector: '[data-tour="ide-run-audit"]',
    title: "Run an accessibility audit",
    body: "Sample jsx-a11y findings are in the console (missing alt text, unlabeled inputs). On a real project this runs eslint-plugin-jsx-a11y against the directory.",
    position: "bottom",
  },
  {
    id: "ide-ai-fix",
    page: "ide",
    selector: '[data-tour="ide-ai-fix"]',
    title: "AI Fix",
    body: "Sends the open file to your configured LLM and shows a diff. Requires a working model (local Ollama or a cloud key).",
    position: "bottom",
  },
  {
    id: "nav-browser",
    page: "ide",
    selector: "#tour-nav-browser",
    title: "Browser Auditor",
    body: "Audit a live URL with axe-core, preview empathy filters, and get HTML fixes.",
    position: "right",
  },
  {
    id: "browser-url",
    page: "browser",
    selector: '[data-tour="browser-url"]',
    title: "Enter a URL",
    body: "example.com is loaded in the preview. Scheme is optional — example.com becomes https://example.com. localhost uses http.",
    position: "bottom",
  },
  {
    id: "browser-audit",
    page: "browser",
    selector: '[data-tour="browser-audit"]',
    title: "Run axe-core",
    body: "Audit injects axe-core into the live page and lists real violations. The preview uses an Electron webview so sites that block iframes still render.",
    position: "bottom",
  },
  {
    id: "browser-filter",
    page: "browser",
    selector: '[data-tour="browser-filter"]',
    title: "Empathy filters",
    body: "The W3C inaccessible demo is loading so the filters have more UI to work with. Try color blindness or low vision on the live page.",
    position: "bottom",
  },
  {
    id: "browser-sr",
    page: "browser",
    selector: '[data-tour="browser-sr"]',
    title: "Screen reader simulation",
    body: "After the page loads, turn this on and Tab through the preview. Announcements speak the accessible name and role.",
    position: "bottom",
  },
  {
    id: "browser-violations",
    page: "browser",
    selector: '[data-tour="browser-violations"]',
    title: "Violations and AI HTML fix",
    body: "Select a violation to request an AI-suggested HTML fix. This needs a configured LLM, same as IDE AI Fix.",
    position: "left",
  },
];
