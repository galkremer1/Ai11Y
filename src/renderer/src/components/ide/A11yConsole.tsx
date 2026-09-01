import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
import type { EslintError } from "@shared/schemas/eslint.schemas";

interface A11yConsoleProps {
  errors: EslintError[];
}

export function A11yConsole({ errors }: A11yConsoleProps) {
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warnCount = errors.filter((e) => e.severity === "warning").length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Split
        style={{
          padding:
            "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)",
          borderBottom: "1px solid var(--pf-t--global--border--color--default)",
        }}
        hasGutter
      >
        <SplitItem>
          <strong
            style={{
              fontSize: "var(--pf-t--global--font--size--xs)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Problems
          </strong>
        </SplitItem>
        <SplitItem>
          <Label color="red" isCompact icon={<ExclamationCircleIcon />}>
            {errorCount}
          </Label>
        </SplitItem>
        <SplitItem>
          <Label color="yellow" isCompact icon={<ExclamationTriangleIcon />}>
            {warnCount}
          </Label>
        </SplitItem>
      </Split>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <DataList aria-label="Accessibility problems" isCompact>
          {errors.map((err, i) => (
            <DataListItem key={i} id={`error-${i}`}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="icon" isIcon width={1}>
                      {err.severity === "error" ? (
                        <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />
                      ) : (
                        <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />
                      )}
                    </DataListCell>,
                    <DataListCell key="content" width={5}>
                      <div>{err.message}</div>
                      <small
                        style={{
                          color: "var(--pf-t--global--text--color--subtle)",
                        }}
                      >
                        {err.file}:{err.line}:{err.column} — {err.ruleId}
                      </small>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </div>
    </div>
  );
}
