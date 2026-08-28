import { useCallback } from 'react'
import type { LLMSettings } from '../types/settings'

export function useIpc() {
  const getSettings = useCallback(() => window.api.getSettings(), [])
  const saveSettings = useCallback(
    (settings: LLMSettings) => window.api.saveSettings(settings),
    []
  )
  const testConnection = useCallback(
    (settings: LLMSettings) => window.api.testConnection(settings),
    []
  )
  const selectDirectory = useCallback(() => window.api.selectDirectory(), [])

  return { getSettings, saveSettings, testConnection, selectDirectory }
}
