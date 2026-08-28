import { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, ActionGroup, Button } from '@patternfly/react-core'
import { TopBar } from '../components/layout/TopBar'
import { ModeToggle } from '../components/setup/ModeToggle'
import { CloudConfig } from '../components/setup/CloudConfig'
import { LocalConfig } from '../components/setup/LocalConfig'
import { ConnectionTest } from '../components/setup/ConnectionTest'
import { useIpc } from '../hooks/useIpc'
import { defaultSettings, type LLMSettings } from '../types/settings'

interface SetupProps {
  title: string
}

export function Setup({ title }: SetupProps) {
  const { getSettings, saveSettings } = useIpc()
  const [settings, setSettings] = useState<LLMSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error)
  }, [getSettings])

  const handleSave = async () => {
    await saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <TopBar title={title} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--pf-t--global--spacer--lg)' }}>
        <Card style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <CardTitle>
            {settings.mode === 'cloud' ? 'Cloud API Configuration' : 'Local Ollama Configuration'}
          </CardTitle>
          <CardBody>
            <ModeToggle mode={settings.mode} onChange={(mode) => setSettings({ ...settings, mode })} />

            <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
              {settings.mode === 'cloud' ? (
                <CloudConfig settings={settings} onChange={setSettings} />
              ) : (
                <LocalConfig settings={settings} onChange={setSettings} />
              )}
            </div>

            <ActionGroup style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
              <Button variant="secondary" onClick={handleSave}>
                {saved ? 'Saved!' : 'Save Settings'}
              </Button>
              <ConnectionTest settings={settings} />
            </ActionGroup>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
