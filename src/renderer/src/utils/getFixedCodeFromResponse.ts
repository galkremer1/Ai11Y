import type { AnalyzeCodeResponse } from "@shared/schemas/ai-analysis.schemas";

export function getFixedCodeFromResponse(
  originalCode: string,
  response: AnalyzeCodeResponse,
): string {
  const fullFileFix = response.fixes.find(
    (fix) => fix.original === originalCode,
  );
  if (fullFileFix) return fullFileFix.fixed;

  let fixed = originalCode;
  for (const fix of response.fixes) {
    if (fix.original === originalCode) continue;
    if (fixed.includes(fix.original)) {
      fixed = fixed.replace(fix.original, fix.fixed);
    }
  }
  return fixed;
}
