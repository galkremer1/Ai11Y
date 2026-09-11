import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
import InfoCircleIcon from "@patternfly/react-icons/dist/esm/icons/info-circle-icon";
import type { AxeViolation } from "@shared/schemas/axe.schemas";

interface AxeViolationsProps {
  violations: AxeViolation[];
  selectedKey?: string | null;
  onSelectViolation?: (violation: AxeViolation, key: string) => void;
}

type Impact = AxeViolation["impact"];

const impactConfig: Record<
  Impact,
  { icon: React.ReactNode; labelColor: "red" | "orange" | "yellow" | "blue" }
> = {
  critical: { icon: <ExclamationCircleIcon />, labelColor: "red" },
  serious: { icon: <ExclamationCircleIcon />, labelColor: "orange" },
  moderate: { icon: <ExclamationTriangleIcon />, labelColor: "yellow" },
  minor: { icon: <InfoCircleIcon />, labelColor: "blue" },
};

export function AxeViolations({
  violations,
  selectedKey,
  onSelectViolation,
}: AxeViolationsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div
        style={{
          padding:
            "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)",
          borderBottom: "1px solid var(--pf-t--global--border--color--default)",
        }}
      >
        <strong
          style={{
            fontSize: "var(--pf-t--global--font--size--xs)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Axe-Core Violations ({violations.length})
        </strong>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <DataList aria-label="Axe-core violations" isCompact>
          {violations.map((v, index) => {
            const { icon, labelColor } = impactConfig[v.impact];
            const itemKey = `${v.id}-${index}`;
            const isSelected = selectedKey === itemKey;
            return (
              <DataListItem
                key={itemKey}
                id={`violation-${itemKey}`}
                aria-labelledby={`violation-${itemKey}-label`}
                isExpanded
              >
                <DataListItemRow
                  onClick={() => onSelectViolation?.(v, itemKey)}
                  style={{
                    cursor: onSelectViolation ? "pointer" : undefined,
                    backgroundColor: isSelected
                      ? "var(--pf-t--global--background--color--secondary--default)"
                      : undefined,
                  }}
                >
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="icon" isIcon width={1}>
                        {icon}
                      </DataListCell>,
                      <DataListCell key="content" width={5}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--pf-t--global--spacer--sm)",
                          }}
                        >
                          <strong id={`violation-${itemKey}-label`}>{v.id}</strong>
                          <Label color={labelColor} isCompact>
                            {v.impact}
                          </Label>
                        </div>
                        <p
                          style={{
                            marginTop: "var(--pf-t--global--spacer--xs)",
                            color: "var(--pf-t--global--text--color--subtle)",
                          }}
                        >
                          {v.description}
                        </p>
                        {v.nodes.map((node, i) => (
                          <div
                            key={i}
                            style={{
                              marginTop: "var(--pf-t--global--spacer--sm)",
                              padding: "var(--pf-t--global--spacer--sm)",
                              backgroundColor:
                                "var(--pf-t--global--background--color--secondary--default)",
                              borderRadius:
                                "var(--pf-t--global--border--radius--small)",
                            }}
                          >
                            <code
                              style={{
                                fontSize: "var(--pf-t--global--font--size--xs)",
                              }}
                            >
                              {node.html}
                            </code>
                            <p
                              style={{
                                marginTop: "var(--pf-t--global--spacer--xs)",
                                fontSize: "var(--pf-t--global--font--size--xs)",
                                color:
                                  "var(--pf-t--global--text--color--subtle)",
                              }}
                            >
                              {node.failureSummary}
                            </p>
                          </div>
                        ))}
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            );
          })}
        </DataList>
      </div>
    </div>
  );
}
