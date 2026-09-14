import {
  Form,
  FormGroup,
  TextInput,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import type { LLMSettings } from "@shared/schemas/settings.schemas";

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
          data-tour="setup-local-url"
        />
        <HelperText>
          <HelperTextItem>
            Ollama native URL is http://localhost:11434 — /v1 is added
            automatically for the OpenAI-compatible API.
          </HelperTextItem>
        </HelperText>
      </FormGroup>

      <FormGroup label="Model Name" fieldId="local-model">
        <TextInput
          id="local-model"
          value={local.modelName}
          onChange={(_e, value) => update({ modelName: value })}
          placeholder="llama3.2"
          data-tour="setup-local-model"
        />
        <HelperText>
          <HelperTextItem>
            Must match a tag from `ollama list` (for example llama3.2:latest).
          </HelperTextItem>
        </HelperText>
      </FormGroup>
    </Form>
  );
}
