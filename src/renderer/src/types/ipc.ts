import type { LLMSettings } from './settings'

export interface IpcApi {
  getSettings(): Promise<LLMSettings>
  saveSettings(settings: LLMSettings): Promise<void>
  testConnection(settings: LLMSettings): Promise<{ ok: boolean; message: string }>
  selectDirectory(): Promise<string | null>
}

declare global {
  interface Window {
    api: IpcApi
  }
}
