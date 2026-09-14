export function normalizeOllamaBaseURL(input?: string): string {
  const fallback = "http://localhost:11434/v1";
  const raw = (input ?? fallback).trim();
  if (!raw) return fallback;

  try {
    const url = new URL(raw.includes("://") ? raw : `http://${raw}`);
    const path = url.pathname.replace(/\/+$/, "") || "";
    if (path === "" || path === "/") {
      url.pathname = "/v1";
    }
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

export function ollamaOriginFromBaseURL(openaiBaseURL: string): string {
  try {
    return new URL(openaiBaseURL).origin;
  } catch {
    return "http://localhost:11434";
  }
}

export async function listOllamaModels(openaiBaseURL: string): Promise<string[]> {
  const origin = ollamaOriginFromBaseURL(openaiBaseURL);
  let response: Response;
  try {
    response = await fetch(`${origin}/api/tags`);
  } catch {
    throw new Error(
      `Cannot reach Ollama at ${origin}. Is it running? Start it with \`ollama serve\`.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Ollama is not reachable at ${origin} (HTTP ${response.status}).`,
    );
  }

  const data = (await response.json()) as {
    models?: Array<{ name?: string; model?: string }>;
  };
  const names = (data.models ?? [])
    .flatMap((model) => [model.name, model.model])
    .filter((name): name is string => Boolean(name));
  return [...new Set(names)];
}

export function modelIsInstalled(
  modelName: string,
  installed: string[],
): boolean {
  const want = modelName.trim();
  if (!want) return false;
  return installed.some((tag) => {
    if (tag === want) return true;
    if (tag === `${want}:latest`) return true;
    if (want.endsWith(":latest") && tag === want.slice(0, -":latest".length)) {
      return true;
    }
    return false;
  });
}
