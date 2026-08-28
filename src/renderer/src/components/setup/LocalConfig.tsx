import { Form, FormGroup, TextInput } from "@patternfly/react-core";
import type { LLMSettings } from "../../types/settings";

interface LocalConfigProps {
  settings: LLMSettings;
  onChange: (settings: LLMSettings) => void;
}

export function LocalConfig({ settings, onChange }: LocalConfigProps) {
  const local = settings.local;

  const update = (partial: Partial<typeof local>) =>
    onChange({ ...settings, local: { ...local, ...partial } });

  return (
    <Form>
      <FormGroup label="Base URL" fieldId="local-base-url">
        <TextInput
          id="local-base-url"
          type="url"
          value={local.baseURL}
          onChange={(_e, value) => update({ baseURL: value })}
          placeholder="http://localhost:11434/v1"
        />
      </FormGroup>

      <FormGroup label="Model Name" fieldId="local-model">
        <TextInput
          id="local-model"
          value={local.modelName}
          onChange={(_e, value) => update({ modelName: value })}
          placeholder="Ollama/llama3.2:1b"
        />
      </FormGroup>
    </Form>
  );
}
