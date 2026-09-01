import type { LLMSettings } from "../schemas/settings.schemas";

export const defaultSettings: LLMSettings = {
  mode: "local",
  cloud: {
    provider: "openai",
    apiKey: "",
    modelName: "gpt-4o",
  },
  local: {
    baseURL: "http://localhost:11434/v1",
    modelName: "Ollama/llama3.2:1b",
  },
};
