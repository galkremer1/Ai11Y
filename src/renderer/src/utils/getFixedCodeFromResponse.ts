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
  if (fixed !== originalCode) return fixed;

  const plausible = response.fixes
    .map((fix) => fix.fixed)
    .filter((candidate) => candidate.length >= originalCode.length * 0.5)
    .sort((a, b) => b.length - a.length)[0];
  return plausible ?? originalCode;
}
