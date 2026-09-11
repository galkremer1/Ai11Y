import { useCallback, useState } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInput,
  Button,
  Split,
  SplitItem,
  Alert,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
import { TopBar } from "../components/layout/TopBar";
import { EmpathyViewer } from "../components/browser/EmpathyViewer";
import { EmpathyControls } from "../components/browser/EmpathyControls";
import { AxeViolations } from "../components/browser/AxeViolations";
import { CodeFix } from "../components/browser/CodeFix";
import { useBrowserServices } from "../hooks/useBrowserServices";
import {
  AxeAuditRequestSchema,
  type AxeViolation,
} from "@shared/schemas/axe.schemas";

interface BrowserAuditorProps {
  title: string;
}

export function BrowserAuditor({ title }: BrowserAuditorProps) {
  const { runAxeAudit, analyzeHtml } = useBrowserServices();
  const [url, setUrl] = useState("");
  const [filter, setFilter] = useState("none");
  const [screenReaderOn, setScreenReaderOn] = useState(false);
  const [violations, setViolations] = useState<AxeViolation[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [selectedViolationKey, setSelectedViolationKey] = useState<
    string | null
  >(null);
  const [fixOriginal, setFixOriginal] = useState("");
  const [fixFixed, setFixFixed] = useState("");
  const [fixLoading, setFixLoading] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);

  const handleAudit = useCallback(async () => {
    setAuditError(null);
    setFixError(null);
    setSelectedViolationKey(null);
    setFixOriginal("");
    setFixFixed("");

    const parsed = AxeAuditRequestSchema.safeParse({ url: url.trim() });
    if (!parsed.success) {
      setAuditError("Enter a valid URL (e.g. https://example.com)");
      return;
    }

    setAuditLoading(true);
    try {
      const result = await runAxeAudit(parsed.data);
      if (!result.ok) {
        setAuditError(result.error);
        setViolations([]);
        return;
      }
      setViolations(result.data.violations);
    } finally {
      setAuditLoading(false);
    }
  }, [url, runAxeAudit]);

  const handleSelectViolation = useCallback(
    async (violation: AxeViolation, key: string) => {
      setSelectedViolationKey(key);
      setFixError(null);

      const html = violation.nodes[0]?.html;
      if (!html) {
        setFixError("This violation has no HTML snippet to analyze.");
        setFixOriginal("");
        setFixFixed("");
        return;
      }

      setFixLoading(true);
      try {
        const result = await analyzeHtml({
          html,
          url: url.trim() || undefined,
        });
        if (!result.ok) {
          setFixError(result.error);
          setFixOriginal(html);
          setFixFixed("");
          return;
        }
        const fix = result.data.fixes[0];
        if (!fix) {
          setFixOriginal(html);
          setFixFixed(html);
          return;
        }
        setFixOriginal(fix.original);
        setFixFixed(fix.fixed);
      } finally {
        setFixLoading(false);
      }
    },
    [analyzeHtml, url],
  );

  return (
    <>
      <TopBar title={title} />
      {auditError && (
        <Alert
          variant="danger"
          title={auditError}
          isInline
          style={{ margin: "8px 8px 0" }}
        />
      )}
      {fixError && (
        <Alert
          variant="warning"
          title={fixError}
          isInline
          style={{ margin: "8px 8px 0" }}
        />
      )}
      {/* URL Bar */}
      <Toolbar style={{ padding: "8px" }}>
        <ToolbarContent>
          <ToolbarItem>
            <SearchIcon style={{ marginTop: "8px" }} />
          </ToolbarItem>
          <ToolbarItem style={{ flex: 1 }}>
            <TextInput
              type="url"
              value={url}
              onChange={(_e, value) => setUrl(value)}
              placeholder="Enter URL to audit (e.g. https://example.com)"
              aria-label="URL to audit"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="primary"
              isLoading={auditLoading}
              onClick={handleAudit}
            >
              Audit
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      {/* Empathy Controls */}
      <EmpathyControls
        filter={filter}
        onFilterChange={setFilter}
        screenReaderOn={screenReaderOn}
        onScreenReaderToggle={setScreenReaderOn}
      />

      {/* Main content */}
      <Split style={{ flex: 1, overflow: "hidden" }}>
        <SplitItem
          isFilled
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "var(--pf-t--global--spacer--md)",
          }}
        >
          <EmpathyViewer filter={filter} />
        </SplitItem>
        <SplitItem
          className="ai11y-violations-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: 1, overflow: "hidden" }}>
            <AxeViolations
              violations={violations}
              selectedKey={selectedViolationKey}
              onSelectViolation={handleSelectViolation}
            />
          </div>
          <div
            className="ai11y-codefix-panel"
            style={{
              borderTop:
                "1px solid var(--pf-t--global--border--color--default)",
            }}
          >
            {fixLoading ? (
              <div
                style={{
                  padding: "var(--pf-t--global--spacer--md)",
                  color: "var(--pf-t--global--text--color--subtle)",
                  fontSize: "var(--pf-t--global--font--size--sm)",
                }}
              >
                Generating AI fix…
              </div>
            ) : fixOriginal || fixFixed ? (
              <CodeFix original={fixOriginal} fixed={fixFixed} />
            ) : (
              <div
                style={{
                  padding: "var(--pf-t--global--spacer--md)",
                  color: "var(--pf-t--global--text--color--subtle)",
                  fontSize: "var(--pf-t--global--font--size--sm)",
                }}
              >
                Select a violation to get an AI-suggested HTML fix.
              </div>
            )}
          </div>
        </SplitItem>
      </Split>
    </>
  );
}
