import { useCallback, useEffect, useRef, useState } from "react";
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
import AngleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-left-icon";
import AngleRightIcon from "@patternfly/react-icons/dist/esm/icons/angle-right-icon";
import SyncAltIcon from "@patternfly/react-icons/dist/esm/icons/sync-alt-icon";
import { TopBar } from "../components/layout/TopBar";
import {
  EmpathyViewer,
  type EmpathyViewerHandle,
  type PreviewNavState,
} from "../components/browser/EmpathyViewer/EmpathyViewer";
import { EmpathyControls } from "../components/browser/EmpathyControls";
import { ScreenReaderBar } from "../components/browser/ScreenReaderBar";
import { AxeViolations } from "../components/browser/AxeViolations";
import { CodeFix } from "../components/browser/CodeFix";
import { useBrowserServices } from "../hooks/useBrowserServices";
import {
  AxeAuditRequestSchema,
  type AxeViolation,
} from "@shared/schemas/axe.schemas";
import { useDemoTour } from "../tour/DemoTourProvider";
import { TOUR_DEMO_URLS } from "../tour/tour-demo";

interface BrowserAuditorProps {
  title: string;
}

export function BrowserAuditor({ title }: BrowserAuditorProps) {
  const { runAxeAudit, analyzeHtml } = useBrowserServices();
  const { isActive, page, step, tourSession } = useDemoTour();
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
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
  const [previewReady, setPreviewReady] = useState(false);
  const [loadedDemoKey, setLoadedDemoKey] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const viewerRef = useRef<EmpathyViewerHandle>(null);
  const urlFocusedRef = useRef(false);

  const navigateToUrl = useCallback(
    (rawUrl: string): string | null => {
      const parsed = AxeAuditRequestSchema.safeParse({ url: rawUrl.trim() });
      if (!parsed.success) {
        setAuditError(
          "Enter a valid URL (e.g. example.com or https://example.com)",
        );
        return null;
      }

      setAuditError(null);
      setUrl(rawUrl.trim());

      if (previewUrl !== parsed.data.url) {
        setFixError(null);
        setPreviewUrl(parsed.data.url);
        setPreviewReady(false);
        setSelectedViolationKey(null);
        setFixOriginal("");
        setFixFixed("");
        setViolations([]);
      }

      return parsed.data.url;
    },
    [previewUrl],
  );

  const runAuditForUrl = useCallback(
    async (rawUrl: string) => {
      const normalized = navigateToUrl(rawUrl);
      if (!normalized) return;

      setAuditLoading(true);
      try {
        const result = await runAxeAudit({ url: normalized });
        if (!result.ok) {
          setAuditError(result.error);
          setViolations([]);
          return;
        }
        setViolations(result.data.violations);
      } finally {
        setAuditLoading(false);
      }
    },
    [navigateToUrl, runAxeAudit],
  );

  useEffect(() => {
    if (!isActive || tourSession === 0) return;

    const stepId = step?.id;
    let demoUrl: string | null = null;
    if (
      page === "browser" ||
      stepId === "nav-browser" ||
      stepId === "browser-url" ||
      stepId === "browser-audit"
    ) {
      demoUrl = TOUR_DEMO_URLS.example;
    }
    if (
      stepId === "browser-filter" ||
      stepId === "browser-sr" ||
      stepId === "browser-violations"
    ) {
      demoUrl = TOUR_DEMO_URLS.waiBefore;
    }
    if (!demoUrl) return;

    const key = `${tourSession}:${demoUrl}`;
    if (loadedDemoKey === key) return;
    setLoadedDemoKey(key);
    void runAuditForUrl(demoUrl);
  }, [isActive, tourSession, page, step?.id, loadedDemoKey, runAuditForUrl]);

  const handleAudit = useCallback(async () => {
    await runAuditForUrl(url);
  }, [url, runAuditForUrl]);

  const handleLocationChange = useCallback((loc: string) => {
    setPreviewUrl(loc);
    if (!urlFocusedRef.current) {
      setUrl(loc);
    }
  }, []);

  const handleNavStateChange = useCallback((state: PreviewNavState) => {
    setCanGoBack(state.canGoBack);
    setCanGoForward(state.canGoForward);
  }, []);

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
          url: previewUrl || undefined,
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
    [analyzeHtml, previewUrl],
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
          <ToolbarItem style={{ flex: 1 }} data-tour="browser-url">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                navigateToUrl(url);
              }}
              style={{ width: "100%" }}
            >
              <TextInput
                type="text"
                value={url}
                onChange={(_e, value) => setUrl(value)}
                onFocus={() => {
                  urlFocusedRef.current = true;
                }}
                onBlur={() => {
                  urlFocusedRef.current = false;
                }}
                placeholder="Enter a URL (e.g. example.com)"
                aria-label="URL to open"
              />
            </form>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="plain"
              aria-label="Back"
              icon={<AngleLeftIcon />}
              isDisabled={!canGoBack}
              onClick={() => viewerRef.current?.goBack()}
            />
            <Button
              variant="plain"
              aria-label="Forward"
              icon={<AngleRightIcon />}
              isDisabled={!canGoForward}
              onClick={() => viewerRef.current?.goForward()}
            />
            <Button
              variant="plain"
              aria-label="Refresh"
              icon={<SyncAltIcon />}
              isDisabled={!previewUrl}
              onClick={() => viewerRef.current?.reload()}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="primary"
              type="button"
              isLoading={auditLoading}
              onClick={handleAudit}
              data-tour="browser-audit"
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
          <EmpathyViewer
            ref={viewerRef}
            filter={filter}
            url={previewUrl}
            onPreviewReady={setPreviewReady}
            onLocationChange={handleLocationChange}
            onNavStateChange={handleNavStateChange}
          />
          <ScreenReaderBar
            screenReaderOn={screenReaderOn}
            url={previewUrl}
            previewReady={previewReady}
          />
        </SplitItem>
        <SplitItem
          className="ai11y-violations-panel"
          data-tour="browser-violations"
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
