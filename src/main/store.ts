import { safeStorage } from "electron";
import type { LLMSettings } from "../shared/schemas/settings.schemas";

interface StoreSchema {
  settings: LLMSettings;
}

const defaults: StoreSchema = {
  settings: {
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
  },
};

let storeInstance: import("electron-store").default<StoreSchema> | null = null;

async function getStore() {
  if (!storeInstance) {
    const { default: Store } = await import("electron-store");
    storeInstance = new Store<StoreSchema>({ defaults });
  }
  return storeInstance;
}

export async function getSettings(): Promise<LLMSettings> {
  const store = await getStore();
  const settings = store.get("settings");
  if (settings.cloud.apiKey && safeStorage.isEncryptionAvailable()) {
    try {
      const decrypted = safeStorage.decryptString(
        Buffer.from(settings.cloud.apiKey, "base64"),
      );
      return { ...settings, cloud: { ...settings.cloud, apiKey: decrypted } };
    } catch {
      // Key wasn't encrypted or decryption failed — return as-is
    }
  }
  return settings;
}

export async function saveSettings(settings: LLMSettings): Promise<void> {
  const store = await getStore();
  let apiKey = settings.cloud.apiKey;
  if (apiKey && safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(apiKey);
    apiKey = encrypted.toString("base64");
  }
  store.set("settings", {
    ...settings,
    cloud: { ...settings.cloud, apiKey },
  });
}
