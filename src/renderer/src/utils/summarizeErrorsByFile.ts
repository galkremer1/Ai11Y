import type { EslintError } from "@shared/schemas/eslint.schemas";

export interface FileIssueSummary {
  file: string;
  absolutePath: string;
  count: number;
}

export function summarizeErrorsByFile(
  errors: EslintError[],
  baseDirectory?: string | null,
): FileIssueSummary[] {
  const counts = new Map<string, FileIssueSummary>();

  for (const err of errors) {
    const absolutePath = err.file;
    let displayPath = absolutePath;
    if (baseDirectory && absolutePath.startsWith(baseDirectory)) {
      displayPath = absolutePath
        .slice(baseDirectory.length)
        .replace(/^[/\\]/, "");
    }

    const existing = counts.get(absolutePath);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(absolutePath, {
        file: displayPath,
        absolutePath,
        count: 1,
      });
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}
