import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label,
  Split,
  SplitItem,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import type { EslintError } from "@shared/schemas/eslint.schemas";
import { summarizeErrorsByFile } from "../../utils/summarizeErrorsByFile";

interface A11yConsoleProps {
  errors: EslintError[];
  hasRunAudit?: boolean;
  selectedFilePath?: string | null;
  totalProjectErrors?: number;
  allErrors?: EslintError[];
  projectDirectory?: string | null;
}

export function A11yConsole({
  errors,
  hasRunAudit = false,
  selectedFilePath = null,
  totalProjectErrors = 0,
  allErrors = [],
  projectDirectory = null,
}: A11yConsoleProps) {
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warnCount = errors.filter((e) => e.severity === "warning").length;

  const renderEmptyState = () => {
    if (!hasRunAudit) {
      return (
        <EmptyState>
          <EmptyStateBody>
            Run an audit to scan the project for accessibility issues. Results
            appear here. Use <strong>AI Fix</strong> to get suggested code
            changes for the open file.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    if (selectedFilePath && totalProjectErrors > 0 && errors.length === 0) {
      const fileSummaries = summarizeErrorsByFile(allErrors, projectDirectory);

      return (
        <EmptyState>
          <EmptyStateBody>
            <CheckCircleIcon
              style={{
                marginRight: "var(--pf-t--global--spacer--sm)",
                color: "var(--pf-t--global--color--status--success--default)",
              }}
            />
            No issues in this file. The audit found {totalProjectErrors} issue
            {totalProjectErrors === 1 ? "" : "s"} in other files:
            <ul
              style={{
                marginTop: "var(--pf-t--global--spacer--sm)",
                paddingLeft: "var(--pf-t--global--spacer--lg)",
                textAlign: "left",
              }}
            >
              {fileSummaries.map(({ file, count }) => (
                <li key={file}>
                  <code>{file}</code> — {count} issue{count === 1 ? "" : "s"}
                </li>
              ))}
            </ul>
            Open one of these files in the tree to review and fix them.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    return (
      <EmptyState>
        <EmptyStateBody>
          <CheckCircleIcon
            style={{
              marginRight: "var(--pf-t--global--spacer--sm)",
              color: "var(--pf-t--global--color--status--success--default)",
            }}
          />
          No accessibility issues found. This file looks good.
        </EmptyStateBody>
      </EmptyState>
    );
  };

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
        {errors.length === 0 ? (
          renderEmptyState()
        ) : (
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
        )}
      </div>
    </div>
  );
}
