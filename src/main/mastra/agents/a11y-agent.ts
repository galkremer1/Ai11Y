import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type {
  CloudProvider,
  LLMSettings,
} from "../../../shared/schemas/settings.schemas";
import { GROQ_BASE_URL } from "../../../shared/providers";
import { normalizeOllamaBaseURL } from "../../ollama";

export function getA11yAgent(config: {
  mode: "cloud" | "local";
  provider?: CloudProvider;
  apiKey?: string;
  baseURL?: string;
  modelName: string;
}): Agent {
  const model = createAgentModel(config);

  return new Agent({
    name: "Accessibility Auditor",
    instructions: `
      You are an expert web accessibility engineer.
      Analyze the provided Axe-core JSON violations and broken source code.
      Write corrected framework code (.jsx, .vue, .html).
      Use reasoning (<think> tags if supported) to explain screen-reader impacts.
    `,
    model,
  });
}

export function getA11yAgentFromSettings(settings: LLMSettings): Agent {
  return getA11yAgent({
    mode: settings.mode,
    provider: settings.cloud.provider,
    apiKey: settings.cloud.apiKey,
    baseURL:
      settings.mode === "cloud"
        ? settings.cloud.baseURL
        : settings.local.baseURL,
    modelName:
      settings.mode === "cloud"
        ? settings.cloud.modelName
        : settings.local.modelName,
  });
}

function createAgentModel(config: {
  mode: "cloud" | "local";
  provider?: CloudProvider;
  apiKey?: string;
  baseURL?: string;
  modelName: string;
}) {
  if (config.mode === "local") {
    const openai = createOpenAI({
      baseURL: normalizeOllamaBaseURL(config.baseURL),
      apiKey: "ollama",
    });
    return openai(config.modelName);
  }

  if (config.provider === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: config.apiKey || "",
    });
    return anthropic(config.modelName);
  }

  const baseURL =
    config.baseURL ||
    (config.provider === "groq" ? GROQ_BASE_URL : undefined);
  const openai = createOpenAI({
    baseURL,
    apiKey: config.apiKey,
  });
  return openai(config.modelName);
}
