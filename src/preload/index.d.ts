import type { IpcApi } from "../shared/types/ipc-api";

declare global {
  interface Window {
    api: IpcApi;
  }
}
