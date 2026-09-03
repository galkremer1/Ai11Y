# ai11y

AI-powered desktop accessibility auditor. Scans web pages and source code for WCAG violations, suggests fixes using LLMs, and provides empathy simulations for vision impairments.

## Features

- **IDE Auditor** — Open a project directory, view accessibility lint errors inline, and accept AI-generated code fixes via a diff viewer.
- **Browser Auditor** — Enter a URL, run axe-core analysis, preview the page through vision impairment filters (protanopia, deuteranopia, etc.), and get AI-corrected markup.
- **Setup** — Switch between cloud API providers (OpenAI, Anthropic, Grok) or a local Ollama instance for fully offline operation.

## Tech Stack

Electron + React 18 + TypeScript, PatternFly v6 (UI), Monaco Editor, Mastra.AI (agent orchestration), axe-core.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Type check:

```bash
npm run typecheck
```

## macOS: Accessibility Permissions

macOS may block Electron from running due to app protection (Gatekeeper). If you see _"app is damaged"_ or it won't open:

```bash
xattr -cr /path/to/ai11y.app
```

For development builds launched from the terminal, you may also need to grant Accessibility permissions under **System Settings > Privacy & Security > Accessibility** to your terminal app (Terminal, iTerm2, etc.).

## Team members

https://github.com/galkremer1
https://github.com/johnson2500
https://github.com/LilyLinh
https://github.com/sussen-redhat
https://github.com/adamviktora
