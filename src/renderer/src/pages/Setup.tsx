import { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Flex,
} from "@patternfly/react-core";
import { TopBar } from "../components/layout/TopBar";
import { ModeToggle } from "../components/setup/ModeToggle";
import { CloudConfig } from "../components/setup/CloudConfig";
import { LocalConfig } from "../components/setup/LocalConfig";
import { ConnectionTest } from "../components/setup/ConnectionTest";
import { useSettings } from "../hooks/useSettings";
import { useDemoTour } from "../tour/DemoTourProvider";
import { defaultSettings } from "@shared/mocks/mock-settings";
import type { LLMSettings } from "@shared/schemas/settings.schemas";

interface SetupProps {
  title: string;
}

export function Setup({ title }: SetupProps) {
  const { getSettings, saveSettings } = useSettings();
  const { start } = useDemoTour();
  const [settings, setSettings] = useState<LLMSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, [getSettings]);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <TopBar title={title} />
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--pf-t--global--spacer--lg)",
        }}
      >
        <Card style={{ maxWidth: "32rem", margin: "0 auto" }}>
          <CardTitle>
            {settings.mode === "cloud"
              ? "Cloud API Configuration"
              : "Local Ollama Configuration"}
          </CardTitle>
          <CardBody>
            <div data-tour="setup-mode">
              <ModeToggle
                mode={settings.mode}
                onChange={(mode) => setSettings({ ...settings, mode })}
              />
            </div>

            <div style={{ marginTop: "var(--pf-t--global--spacer--lg)" }}>
              {settings.mode === "cloud" ? (
                <CloudConfig settings={settings} onChange={setSettings} />
              ) : (
                <LocalConfig settings={settings} onChange={setSettings} />
              )}
            </div>

            <Flex style={{ marginTop: "var(--pf-t--global--spacer--lg)" }}>
              <Button
                variant="secondary"
                onClick={handleSave}
                data-tour="setup-save"
              >
                {saved ? "Saved!" : "Save Settings"}
              </Button>
              <ConnectionTest
                settings={settings}
                onSelectModel={(modelName) =>
                  setSettings({
                    ...settings,
                    local: { ...settings.local, modelName },
                  })
                }
              />
            </Flex>
          </CardBody>
        </Card>

        <Card
          style={{
            maxWidth: "32rem",
            margin: "var(--pf-t--global--spacer--lg) auto 0",
          }}
        >
          <CardTitle>Product tour</CardTitle>
          <CardBody>
            <p style={{ marginTop: 0 }}>
              Walk through Setup, IDE Auditor, and Browser Auditor step by step.
              You can use the real controls while the coach marks are open.
            </p>
            <Button
              style={{ marginTop: "var(--pf-t--global--spacer--md)" }}
              variant="primary"
              onClick={start}
              data-tour="setup-tour"
            >
              Start product tour
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
