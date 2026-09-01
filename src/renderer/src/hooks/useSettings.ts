import { useCallback } from "react";
import { useApi } from "../services/ApiProvider";
import type { LLMSettings } from "@shared/schemas/settings.schemas";

export function useSettings() {
  const api = useApi();

  const getSettings = useCallback(() => api.getSettings(), [api]);
  const saveSettings = useCallback(
    (settings: LLMSettings) => api.saveSettings(settings),
    [api],
  );
  const testConnection = useCallback(
    (settings: LLMSettings) => api.testConnection(settings),
    [api],
  );

  return { getSettings, saveSettings, testConnection };
}
