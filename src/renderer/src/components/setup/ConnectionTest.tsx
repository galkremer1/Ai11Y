import { useState } from "react";
import { Button, Alert, Flex } from "@patternfly/react-core";
import type {
  ConnectionTestResult,
  LLMSettings,
} from "@shared/schemas/settings.schemas";
import { useSettings } from "../../hooks/useSettings";

interface ConnectionTestProps {
  settings: LLMSettings;
  onSelectModel?: (modelName: string) => void;
}

export function ConnectionTest({
  settings,
  onSelectModel,
}: ConnectionTestProps) {
  const { testConnection } = useSettings();
  const [status, setStatus] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setStatus(null);
    try {
      const result = await testConnection(settings);
      setStatus(result);
    } catch (err: unknown) {
      setStatus({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setTesting(false);
    }
  };

  const models = status?.availableModels?.filter(Boolean) ?? [];

  return (
    <div>
      <Button
        variant="primary"
        isLoading={testing}
        onClick={handleTest}
        isDisabled={testing}
        data-tour="setup-test"
      >
        {testing ? "Testing..." : "Test Model Connection"}
      </Button>
      {status && (
        <Alert
          variant={status.ok ? "success" : "danger"}
          isInline
          isPlain
          title={status.message}
          style={{ marginTop: "var(--pf-t--global--spacer--sm)" }}
        >
          {!status.ok && models.length > 0 && (
            <Flex
              spaceItems={{ default: "spaceItemsSm" }}
              style={{ flexWrap: "wrap", alignItems: "center" }}
            >
              <span>Available:</span>
              {models.map((model) => (
                <Button
                  key={model}
                  variant="link"
                  isInline
                  onClick={() => onSelectModel?.(model)}
                >
                  {model}
                </Button>
              ))}
            </Flex>
          )}
          {!status.ok && models.length === 0 && status.availableModels && (
            <p>No models are pulled yet. Run `ollama pull llama3.2` first.</p>
          )}
        </Alert>
      )}
    </div>
  );
}
