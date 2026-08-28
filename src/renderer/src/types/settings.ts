export type LLMMode = "cloud" | "local";

export type CloudProvider = "openai" | "anthropic" | "groq" | "custom";

export interface LLMSettings {
  mode: LLMMode;
  cloud: {
    provider: CloudProvider;
    apiKey: string;
    baseURL?: string;
    modelName: string;
  };
  local: {
    baseURL: string;
    modelName: string;
  };
}

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
