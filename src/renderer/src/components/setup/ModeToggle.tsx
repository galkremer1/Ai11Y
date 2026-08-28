import { FormGroup, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import type { LLMMode } from '../../types/settings'

interface ModeToggleProps {
  mode: LLMMode
  onChange: (mode: LLMMode) => void
}

const options: { value: LLMMode; label: string }[] = [
  { value: 'cloud', label: 'Cloud API' },
  { value: 'local', label: 'Local Ollama' }
]

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <FormGroup label="Execution Mode" fieldId="mode-toggle">
      <ToggleGroup aria-label="Execution mode toggle">
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            text={opt.label}
            buttonId={`mode-${opt.value}`}
            isSelected={mode === opt.value}
            onChange={() => onChange(opt.value)}
          />
        ))}
      </ToggleGroup>
    </FormGroup>
  )
}
