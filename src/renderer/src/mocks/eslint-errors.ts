export interface EslintError {
  file: string
  line: number
  column: number
  ruleId: string
  severity: 'error' | 'warning'
  message: string
}

export const mockEslintErrors: EslintError[] = [
  {
    file: 'src/components/LoginForm.tsx',
    line: 12,
    column: 5,
    ruleId: 'jsx-a11y/label-has-associated-control',
    severity: 'error',
    message: 'A form label must be associated with a control.'
  },
  {
    file: 'src/components/LoginForm.tsx',
    line: 18,
    column: 9,
    ruleId: 'jsx-a11y/no-autofocus',
    severity: 'warning',
    message: 'The autoFocus prop should not be used, as it can reduce usability and accessibility for users.'
  },
  {
    file: 'src/components/NavBar.tsx',
    line: 7,
    column: 3,
    ruleId: 'jsx-a11y/anchor-is-valid',
    severity: 'error',
    message: 'The href attribute requires a valid value to be accessible.'
  },
  {
    file: 'src/components/ImageCard.tsx',
    line: 22,
    column: 7,
    ruleId: 'jsx-a11y/alt-text',
    severity: 'error',
    message: 'img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.'
  },
  {
    file: 'src/components/Modal.tsx',
    line: 5,
    column: 3,
    ruleId: 'jsx-a11y/click-events-have-key-events',
    severity: 'warning',
    message: 'Visible, non-interactive elements with click handlers must have at least one keyboard listener.'
  },
  {
    file: 'src/components/Modal.tsx',
    line: 5,
    column: 3,
    ruleId: 'jsx-a11y/no-static-element-interactions',
    severity: 'warning',
    message: 'Static HTML elements with event handlers require a role.'
  }
]
