# Gemini brief: Ai11Y challenge video + slides

Generate **(A) a short slide deck** and **(B) a video script + YouTube/description text** for an intern/associate **innovation challenge** submission.

**Framing (mandatory):** This is a **proposal**. The running app is a **prototype built during the challenge** to show the idea is feasible — not a finished product. Say “we propose” / “prototype” / “proof of concept.” Do not claim production readiness, WCAG certification, or that this replaces disabled testers.

**Length:** Video **max 5 minutes** (aim ~4:00). Slides: **6–8**, sparse. After the benefits slide, the remaining time is **live demo**.

**Tone:** clear, judge-friendly, no jargon without a one-line gloss. Dark PatternFly v6 UI. Product: **Ai11Y** (AI + a11y).

**Do not invent features.** Facts below are canonical. README says “Grok”; the app uses **Groq**.

---

## Fill in before publishing (video description)

Judges require these in the **video description**. If a field is unknown, keep the placeholder — do not guess a Red Hat program name.

| Field                  | Value                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Challenge category** | `[FILL IN — e.g. Artificial Intelligence, Accessibility, Developer Experience]`                                                      |
| **Team name**          | **Ai11Y** (repo: Ai11Y)                                                                                                              |
| **Team members**       | Leon Kladnitsky, Stella Ihenacho, Saumya Gangwal, Aviv Turgeman, Adam Viktora, Linh Ha Cao Thuy, Gal Kremer, RJ Johnson, Susmita Sen |

---

## A. Slide outline

### 1. Title

**Ai11Y** — a proposed AI-powered desktop accessibility auditor  
_Prototype built during the challenge period_

**Team:** Ai11Y  
**Members:** Leon Kladnitsky, Stella Ihenacho, Saumya Gangwal, Aviv Turgeman, Adam Viktora, Linh Ha Cao Thuy, Gal Kremer, RJ Johnson, Susmita Sen

Put names on the title slide. Do **not** read all nine names in the video (too slow); they belong in the **video description** and on-slide.

### 2. Problem

Accessibility work is fragmented:

- **Code** linters (jsx-a11y) vs **runtime** checkers (axe-core) vs **empathy** (how the UI feels)
- Fixes are still mostly **manual**
- Cloud-only AI is a barrier for some teams; **offline** local models are rarely in the same tool

### 3. Proposed solution (not a finished product)

One **Electron desktop app** that would let developers:

1. Audit **source** (IDE) and **live pages** (browser) in one place
2. **See** issues the way users might (vision filters, screen-reader simulation)
3. **Ask an LLM** for a suggested fix, then **review a diff** before applying

Three surfaces: **Setup** · **IDE Auditor** · **Browser Auditor**

### 4. How AI is used

- **Detection is not the LLM.** ESLint (`eslint-plugin-jsx-a11y`) and **axe-core** find WCAG-related issues deterministically.
- **Generation is the LLM.** A **Mastra** accessibility agent turns findings + source/HTML into proposed **code fixes** and **HTML fixes** (original vs fixed + explanation).
- **Bring your own model:** local **Ollama** (offline) or cloud **OpenAI / Anthropic / Groq** (or custom OpenAI-compatible). Same agent, different provider.
- Human stays in the loop: diff viewer, accept/reject. AI does not silently overwrite the live page.

### 5. Expected benefits and outcomes

- Faster path from **issue → suggested patch** in the tools developers already understand (editor + browser).
- **Empathy** in-context (filters, SR bar) so a11y is not only a JSON report.
- **Local LLM option** for air-gapped / no-key demos.
- Outcome we are aiming at (proposal): fewer late-stage a11y bugs, easier onboarding to WCAG work — **not** a substitute for real assistive-tech testing.

### 6. Work completed during the challenge (prototype)

What the team actually built (POC):

- Electron + React 18 + TypeScript + **PatternFly v6** + Monaco
- Setup: persist settings, test connection, Ollama `/v1` + `/api/tags`, cloud providers
- IDE: directory tree, jsx-a11y audit, Monaco, **AI Fix** + diff, accept write-back
- Browser: URL bar (Enter to navigate), back/forward/refresh, **webview** preview, **axe-core**, vision filters, screen-reader inject, **AI HTML fix** on a selected violation
- In-app **product tour**; sidebar views **keep state**

Stack: Electron, React, PatternFly v6, Monaco, **Mastra.AI**, axe-core.

### 7. Demo agenda (then stop adding feature slides)

_The rest is a live walkthrough of the prototype._

1. Setup — Ollama, test connection
2. IDE — sample lint + AI Fix
3. Browser — live page, filter, screen reader, axe, HTML fix

---

## B. Video script (~4:00–5:00)

| Time      | Beat                                                                                                    | On screen             |
| --------- | ------------------------------------------------------------------------------------------------------- | --------------------- |
| 0:00–0:20 | Title, **proposal**, team **Ai11Y**. One-line problem. Names are on-screen, not spoken.                 | Slide 1–2             |
| 0:20–0:50 | Proposed solution: one desktop app, three surfaces. “This is a prototype, not a ship-ready product.”    | Slide 3               |
| 0:50–1:30 | **How AI is used:** linters/axe detect; Mastra LLM proposes fixes; human reviews; local or cloud model. | Slide 4               |
| 1:30–1:55 | **Benefits:** faster fixes, empathy in-tool, offline option. Honest limit: not a replacement for users. | Slide 5               |
| 1:55–2:10 | **Challenge work:** list 3–4 prototype bullets.                                                         | Slide 6               |
| 2:10–4:40 | **Live demo** (script below).                                                                           | Running `npm run dev` |
| 4:40–5:00 | Close: proposal + next steps (real-user testing, more rules, packaging). Thank judges.                  | Slide 7 or app        |

If short on time, **cut the product tour** and cloud-provider mention.

### Live demo (prototype)

`npm run dev`. macOS: Accessibility permission for the terminal if the OS blocks Electron (README).

**Setup (~30s)**  
Local Ollama, `http://localhost:11434` (app adds `/v1`). Model name = `ollama list` (e.g. `llama3.2:latest`). Save + **Test Model Connection**. Optional: Start product tour.

**IDE (~50s)**  
Sample `LoginForm.tsx` (or Select Directory). Console shows jsx-a11y. **AI Fix** → diff → accept. Say: _the model proposes; we review._

**Browser (~70s)**  
`example.com` + **Enter** (loads without Audit). **Audit** = axe-core. Filter (e.g. deuteranopia). Screen Reader on, Tab. Click a violation → AI HTML fix. Mention back/forward/refresh if there’s a second.

Talking points: detection vs generation; empathy ≠ user research; same agent local or cloud.

---

## C. Video description (paste under the video)

```
Category: Challenge 4
Team: Ai11Y
Members: Leon Kladnitsky, Stella Ihenacho, Saumya Gangwal, Aviv Turgeman, Adam Viktora, Linh Ha Cao Thuy, Gal Kremer, RJ Johnson, Susmita Sen

Ai11Y is a proposal for an AI-powered desktop accessibility auditor. During the challenge we built a prototype (Electron + PatternFly) that combines jsx-a11y and axe-core detection with a Mastra LLM agent that suggests code and HTML fixes (local Ollama or cloud). Empathy filters and a screen-reader simulation help developers feel issues, not only read reports.

This video is a short proposal + demo of the prototype — not a production product.
```

---

## Facts Gemini must not contradict

- Desktop **Electron** app, not a browser extension.
- Proposal + **challenge-period prototype**.
- AI: **Mastra** agent; **does not** replace axe/ESLint.
- Providers: Ollama, OpenAI, Anthropic, **Groq**, custom.
- Do not use stale team-doc goals (“Audit button not wired”, stub IPC) as current gaps unless labeled as _pre-challenge_ backlog that the prototype addressed.

## Optional last slide

Next: packaging, real AT testing, more frameworks. `npm run dev` · GitHub team links.
