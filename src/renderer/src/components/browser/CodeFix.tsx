import { Split, SplitItem, Label } from '@patternfly/react-core'
import { CodeEditor } from '../ide/CodeEditor'

interface CodeFixProps {
  original: string
  fixed: string
}

export function CodeFix({ original, fixed }: CodeFixProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      <div
        style={{
          padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
          borderBottom: '1px solid var(--pf-t--global--border--color--default)'
        }}
      >
        <strong style={{ fontSize: 'var(--pf-t--global--font--size--xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI-Suggested Fix
        </strong>
      </div>
      <Split style={{ flex: 1, overflow: 'hidden' }}>
        <SplitItem isFilled style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--pf-t--global--border--color--default)' }}>
          <div style={{ padding: 'var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--md)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
            <Label color="red" isCompact>Original</Label>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor value={original} readOnly language="html" />
          </div>
        </SplitItem>
        <SplitItem isFilled style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--md)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
            <Label color="green" isCompact>Fixed</Label>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor value={fixed} readOnly language="html" />
          </div>
        </SplitItem>
      </Split>
    </div>
  )
}
