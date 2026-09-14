import {
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import type {
  CloudProvider,
  LLMSettings,
} from "@shared/schemas/settings.schemas";
import { GROQ_BASE_URL } from "@shared/providers";

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

const modelPlaceholders: Record<CloudProvider, string> = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-0",
  groq: "llama-3.3-70b-versatile",
  custom: "gpt-4o",
};

export function CloudConfig({ settings, onChange }: CloudConfigProps) {
  const cloud = settings.cloud;

  const update = (partial: Partial<typeof cloud>) =>
    onChange({ ...settings, cloud: { ...cloud, ...partial } });

  const showBaseURL =
    cloud.provider === "custom" || cloud.provider === "groq";

  return (
    <Form>
      <FormGroup label="Provider" fieldId="cloud-provider">
        <FormSelect
          id="cloud-provider"
          value={cloud.provider}
          onChange={(_e, value) => {
            const provider = value as CloudProvider;
            update({
              provider,
              baseURL:
                provider === "groq"
                  ? cloud.baseURL || GROQ_BASE_URL
                  : cloud.baseURL,
            });
          }}
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

      {showBaseURL && (
        <FormGroup label="Base URL" fieldId="cloud-base-url">
          <TextInput
            id="cloud-base-url"
            type="url"
            value={cloud.baseURL ?? ""}
            onChange={(_e, value) => update({ baseURL: value })}
            placeholder={
              cloud.provider === "groq"
                ? GROQ_BASE_URL
                : "https://api.example.com/v1"
            }
          />
        </FormGroup>
      )}

      <FormGroup label="Model Name" fieldId="cloud-model">
        <TextInput
          id="cloud-model"
          value={cloud.modelName}
          onChange={(_e, value) => update({ modelName: value })}
          placeholder={modelPlaceholders[cloud.provider]}
        />
      </FormGroup>
    </Form>
  );
}
