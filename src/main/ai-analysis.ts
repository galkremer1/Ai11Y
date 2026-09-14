import { getSettings } from "./store";
import { getA11yAgent } from "./mastra/agents/a11y-agent";
import type {
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
} from "../shared/schemas/ai-analysis.schemas";
import { AnalyzeCodeResponseSchema } from "../shared/schemas/ai-analysis.schemas";

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
  const modelName =
    settings.mode === "cloud"
      ? settings.cloud.modelName
      : settings.local.modelName;

  const agent = getA11yAgent({
    mode: settings.mode,
    apiKey: settings.cloud?.apiKey,
    baseURL:
      settings.mode === "cloud"
        ? settings.cloud?.baseURL
        : settings.local?.baseURL,
    modelName,
  });

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
