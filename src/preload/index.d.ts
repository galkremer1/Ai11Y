import type { IpcApi } from '../renderer/src/types/ipc'

declare global {
  interface Window {
    api: IpcApi
  }
}
