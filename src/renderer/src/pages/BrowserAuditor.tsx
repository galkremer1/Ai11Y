import { useState } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInput,
  Button,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
import { TopBar } from "../components/layout/TopBar";
import { EmpathyViewer } from "../components/browser/EmpathyViewer";
import { EmpathyControls } from "../components/browser/EmpathyControls";
import { AxeViolations } from "../components/browser/AxeViolations";
import { CodeFix } from "../components/browser/CodeFix";
import { mockAxeViolations } from "../mocks/axe-violations";

interface BrowserAuditorProps {
  title: string;
}

const fixOriginal = `<img src="/hero-banner.jpg">
<button class="icon-btn"><svg>...</svg></button>
<html>
<a href="/profile"><img src="/avatar.png"></a>`;

const fixFixed = `<img src="/hero-banner.jpg" alt="Hero banner showcasing our product">
<button class="icon-btn" aria-label="Menu"><svg aria-hidden="true">...</svg></button>
<html lang="en">
<a href="/profile" aria-label="View profile"><img src="/avatar.png" alt="User avatar"></a>`;

export function BrowserAuditor({ title }: BrowserAuditorProps) {
  const [url, setUrl] = useState("");
  const [filter, setFilter] = useState("none");
  const [screenReaderOn, setScreenReaderOn] = useState(false);

  return (
    <>
      <TopBar title={title} />
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
            <Button variant="primary">Audit</Button>
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
            <AxeViolations violations={mockAxeViolations} />
          </div>
          <div
            className="ai11y-codefix-panel"
            style={{
              borderTop:
                "1px solid var(--pf-t--global--border--color--default)",
            }}
          >
            <CodeFix original={fixOriginal} fixed={fixFixed} />
          </div>
        </SplitItem>
      </Split>
    </>
  );
}
