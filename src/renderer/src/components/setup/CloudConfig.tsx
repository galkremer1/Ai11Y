import {
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";
import type {
  CloudProvider,
  LLMSettings,
} from "@shared/schemas/settings.schemas";

interface CloudConfigProps {
  settings: LLMSettings;
  onChange: (settings: LLMSettings) => void;
}

const providers: { value: CloudProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
  { value: "custom", label: "Custom OpenAI-Compatible" },
];

export function CloudConfig({ settings, onChange }: CloudConfigProps) {
  const cloud = settings.cloud;

  const update = (partial: Partial<typeof cloud>) =>
    onChange({ ...settings, cloud: { ...cloud, ...partial } });

  return (
    <Form>
      <FormGroup label="Provider" fieldId="cloud-provider">
        <FormSelect
          id="cloud-provider"
          value={cloud.provider}
          onChange={(_e, value) => update({ provider: value as CloudProvider })}
          aria-label="Provider"
        >
          {providers.map((p) => (
            <FormSelectOption key={p.value} value={p.value} label={p.label} />
          ))}
        </FormSelect>
      </FormGroup>

      <FormGroup label="API Key" fieldId="cloud-api-key">
        <TextInput
          id="cloud-api-key"
          type="password"
          value={cloud.apiKey}
          onChange={(_e, value) => update({ apiKey: value })}
          placeholder="sk-..."
        />
      </FormGroup>

      {cloud.provider === "custom" && (
        <FormGroup label="Base URL" fieldId="cloud-base-url">
          <TextInput
            id="cloud-base-url"
            type="url"
            value={cloud.baseURL ?? ""}
            onChange={(_e, value) => update({ baseURL: value })}
            placeholder="https://api.example.com/v1"
          />
        </FormGroup>
      )}

      <FormGroup label="Model Name" fieldId="cloud-model">
        <TextInput
          id="cloud-model"
          value={cloud.modelName}
          onChange={(_e, value) => update({ modelName: value })}
          placeholder="gpt-4o"
        />
      </FormGroup>
    </Form>
  );
}
