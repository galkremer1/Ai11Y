import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label
} from '@patternfly/react-core'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import type { AxeViolation } from '../../mocks/axe-violations'

interface AxeViolationsProps {
  violations: AxeViolation[]
}

type Impact = AxeViolation['impact']

const impactConfig: Record<Impact, { icon: React.ReactNode; labelColor: 'red' | 'orange' | 'yellow' | 'blue' }> = {
  critical: { icon: <ExclamationCircleIcon />, labelColor: 'red' },
  serious: { icon: <ExclamationCircleIcon />, labelColor: 'orange' },
  moderate: { icon: <ExclamationTriangleIcon />, labelColor: 'yellow' },
  minor: { icon: <InfoCircleIcon />, labelColor: 'blue' }
}

export function AxeViolations({ violations }: AxeViolationsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      <div
        style={{
          padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
          borderBottom: '1px solid var(--pf-t--global--border--color--default)'
        }}
      >
        <strong style={{ fontSize: 'var(--pf-t--global--font--size--xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Axe-Core Violations ({violations.length})
        </strong>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <DataList aria-label="Axe-core violations" isCompact>
          {violations.map((v) => {
            const { icon, labelColor } = impactConfig[v.impact]
            return (
              <DataListItem key={v.id} id={`violation-${v.id}`}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="icon" isIcon width={1}>
                        {icon}
                      </DataListCell>,
                      <DataListCell key="content" width={5}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-t--global--spacer--sm)' }}>
                          <strong>{v.id}</strong>
                          <Label color={labelColor} isCompact>
                            {v.impact}
                          </Label>
                        </div>
                        <p style={{ marginTop: 'var(--pf-t--global--spacer--xs)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {v.description}
                        </p>
                        {v.nodes.map((node, i) => (
                          <div
                            key={i}
                            style={{
                              marginTop: 'var(--pf-t--global--spacer--sm)',
                              padding: 'var(--pf-t--global--spacer--sm)',
                              backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                              borderRadius: 'var(--pf-t--global--border--radius--small)'
                            }}
                          >
                            <code style={{ fontSize: 'var(--pf-t--global--font--size--xs)' }}>{node.html}</code>
                            <p style={{ marginTop: 'var(--pf-t--global--spacer--xs)', fontSize: 'var(--pf-t--global--font--size--xs)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {node.failureSummary}
                            </p>
                          </div>
                        ))}
                      </DataListCell>
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            )
          })}
        </DataList>
      </div>
    </div>
  )
}
