import { useState } from "react";
import { Button, Alert } from "@patternfly/react-core";
import type { LLMSettings } from "@shared/schemas/settings.schemas";
import { useSettings } from "../../hooks/useSettings";

interface ConnectionTestProps {
  settings: LLMSettings;
}

export function ConnectionTest({ settings }: ConnectionTestProps) {
  const { testConnection } = useSettings();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
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

  return (
    <div>
      <Button
        variant="primary"
        isLoading={testing}
        onClick={handleTest}
        isDisabled={testing}
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
        />
      )}
    </div>
  );
}
