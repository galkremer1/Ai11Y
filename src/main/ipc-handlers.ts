import { ipcMain, dialog, BrowserWindow } from 'electron'
import { getSettings, saveSettings } from './store'
import { getA11yAgent } from './mastra/agents/a11y-agent'

export function registerIpcHandlers(): void {
  ipcMain.handle('settings:get', () => {
    return getSettings()
  })

  ipcMain.handle('settings:save', async (_event, settings) => {
    await saveSettings(settings)
  })

  ipcMain.handle('connection:test', async (_event, settings) => {
    try {
      const agent = getA11yAgent({
        mode: settings.mode,
        apiKey: settings.cloud?.apiKey,
        baseURL:
          settings.mode === 'cloud' ? settings.cloud?.baseURL : settings.local?.baseURL,
        modelName:
          settings.mode === 'cloud' ? settings.cloud?.modelName : settings.local?.modelName
      })
      const result = await agent.generate('Respond with "ok" and nothing else.')
      return { ok: true, message: `Connected. Response: ${result.text}` }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return { ok: false, message }
    }
  })

  ipcMain.handle('dialog:selectDirectory', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return null
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })
}
