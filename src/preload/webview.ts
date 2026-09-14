import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ai11yHost", {
  announce(payload: unknown) {
    ipcRenderer.sendToHost("ai11y:screen-reader", payload);
  },
});
