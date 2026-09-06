import { useState } from "react";
import { Alert, AlertVariant, Button } from "@patternfly/react-core";
import type { EslintError } from "@shared/schemas/eslint.schemas";
import { summarizeErrorsByFile } from "../../utils/summarizeErrorsByFile";

interface AuditResultAlertProps {
  allErrors: EslintError[];
  selectedFilePath: string | null;
  projectDirectory: string | null;
  onFileSelect: (filePath: string) => void;
}

function getAuditMessage(
  total: number,
  fileCount: number | null,
  fileSummaryCount: number,
): { title: string; body: string; variant: AlertVariant } {
  if (total === 0) {
    return {
      title: "All clear!",
      body: "No accessibility issues were found in this project.",
      variant: AlertVariant.success,
    };
  }

  if (fileCount !== null && fileCount > 0) {
    return {
      title: "Issues found in this file",
      body: `Found ${fileCount} issue${fileCount === 1 ? "" : "s"} in the file you have open (${total} total across the project). Use AI Fix to get suggested changes.`,
      variant: AlertVariant.warning,
    };
  }

  if (fileCount === 0) {
    return {
      title: "Issues found elsewhere",
      body: `Found ${total} issue${total === 1 ? "" : "s"} across ${fileSummaryCount} file${fileSummaryCount === 1 ? "" : "s"}. The file you have open looks good — open one of the affected files below to review.`,
      variant: AlertVariant.info,
    };
  }

  return {
    title: "Audit complete",
    body: `Found ${total} issue${total === 1 ? "" : "s"} across ${fileSummaryCount} file${fileSummaryCount === 1 ? "" : "s"}. Open a file below to review details and use AI Fix for suggested changes.`,
    variant: AlertVariant.info,
  };
}

export function AuditResultAlert({
  allErrors,
  selectedFilePath,
  projectDirectory,
  onFileSelect,
}: AuditResultAlertProps) {
  const [filesExpanded, setFilesExpanded] = useState(false);

  const total = allErrors.length;
  const fileCount = selectedFilePath
    ? allErrors.filter((err) => err.file === selectedFilePath).length
    : null;
  const fileSummaries = summarizeErrorsByFile(allErrors, projectDirectory);
  const { title, body, variant } = getAuditMessage(
    total,
    fileCount,
    fileSummaries.length,
  );

  return (
    <Alert variant={variant} title={title} isInline style={{ margin: "8px" }}>
      <p style={{ margin: 0 }}>{body}</p>
      {fileSummaries.length > 0 && (
        <div style={{ marginTop: "var(--pf-t--global--spacer--sm)" }}>
          <Button
            variant="link"
            isInline
            onClick={() => setFilesExpanded((expanded) => !expanded)}
            style={{ padding: 0 }}
          >
            {filesExpanded ? "Hide files" : "Show files"}
          </Button>
          {filesExpanded && (
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                marginTop: "var(--pf-t--global--spacer--xs)",
                paddingRight: "var(--pf-t--global--spacer--sm)",
              }}
            >
              <ul
                style={{
                  margin: "0 0 0 var(--pf-t--global--spacer--md)",
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {fileSummaries.map(({ file, absolutePath, count }) => (
                  <li
                    key={absolutePath}
                    style={{
                      marginBottom: "var(--pf-t--global--spacer--xs)",
                    }}
                  >
                    <Button
                      variant="link"
                      isInline
                      onClick={() => onFileSelect(absolutePath)}
                      style={{ padding: 0, fontWeight: 500 }}
                    >
                      {file}
                    </Button>
                    <span
                      style={{
                        color: "var(--pf-t--global--text--color--subtle)",
                      }}
                    >
                      {" "}
                      — {count} issue{count === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Alert>
  );
}
