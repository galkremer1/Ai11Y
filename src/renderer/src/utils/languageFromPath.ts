const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "typescriptreact",
  js: "javascript",
  jsx: "javascriptreact",
  json: "json",
  html: "html",
  css: "css",
  scss: "scss",
  md: "markdown",
  vue: "html",
  svelte: "html",
};

export function languageFromPath(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return "plaintext";
  return EXTENSION_LANGUAGE_MAP[ext] ?? "plaintext";
}
