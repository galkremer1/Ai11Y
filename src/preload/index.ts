import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: unknown) => ipcRenderer.invoke('settings:save', settings),
  testConnection: (settings: unknown) => ipcRenderer.invoke('connection:test', settings),
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory')
})
