import { getSettings } from "./store";
import { getA11yAgentFromSettings } from "./mastra/agents/a11y-agent";
import type {
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  AnalyzeHtmlRequest,
  AnalyzeHtmlResponse,
} from "../shared/schemas/ai-analysis.schemas";
import {
  AnalyzeCodeResponseSchema,
  AnalyzeHtmlResponseSchema,
} from "../shared/schemas/ai-analysis.schemas";

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) return text.slice(start, end + 1);

  return text.trim();
}

export async function analyzeCodeWithAgent(
  request: AnalyzeCodeRequest,
): Promise<AnalyzeCodeResponse> {
  const settings = await getSettings();
  const agent = getA11yAgentFromSettings(settings);

  const prompt = `Analyze the following ${request.language} source code for accessibility (WCAG / jsx-a11y) issues.
${request.filePath ? `File path: ${request.filePath}` : ""}

Return ONLY valid JSON matching this shape (no markdown, no commentary):
{
  "fixes": [
    {
      "file": "string",
      "line": number,
      "original": "exact substring from the source",
      "fixed": "corrected substring",
      "explanation": "why this improves accessibility"
    }
  ],
  "summary": "brief summary of all issues found"
}

Include one fix entry where "original" is the ENTIRE source code and "fixed" is the ENTIRE corrected source code.

Source code:
\`\`\`
${request.code}
\`\`\``;

  const result = await agent.generate(prompt);
  const parsed = JSON.parse(extractJson(result.text));
  return AnalyzeCodeResponseSchema.parse(parsed);
}

export async function analyzeHtmlWithAgent(
  request: AnalyzeHtmlRequest,
): Promise<AnalyzeHtmlResponse> {
  const settings = await getSettings();
  const agent = getA11yAgentFromSettings(settings);

  const prompt = `Analyze the following HTML snippet for accessibility (WCAG) issues and suggest a corrected version.
${request.url ? `Page URL: ${request.url}` : ""}

Return ONLY valid JSON matching this shape (no markdown, no commentary):
{
  "fixes": [
    {
      "selector": "CSS selector for the node",
      "original": "exact original HTML",
      "fixed": "corrected HTML",
      "explanation": "why this improves accessibility"
    }
  ],
  "summary": "brief summary of the issues found"
}

Include at least one fix. Prefer keeping the original markup structure and changing only what is needed for accessibility.

HTML:
\`\`\`html
${request.html}
\`\`\``;

  const result = await agent.generate(prompt);
  const parsed = JSON.parse(extractJson(result.text));
  return AnalyzeHtmlResponseSchema.parse(parsed);
}
