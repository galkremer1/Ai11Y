import { Sidebar, type Page } from "./components/layout/Sidebar";
import { IDEAuditor } from "./pages/IDEAuditor";
import { BrowserAuditor } from "./pages/BrowserAuditor";
import { Setup } from "./pages/Setup";
import { DemoTourProvider, useDemoTour } from "./tour/DemoTourProvider";
import { ProductTour } from "./tour/ProductTour";
import { Button, Label } from "@patternfly/react-core";
import type { ReactNode } from "react";

const pageTitles: Record<Page, string> = {
  ide: "IDE Auditor",
  browser: "Browser Auditor",
  setup: "Setup",
};

function PageSlot({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: visible ? "flex" : "none",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}

function AppShell() {
  const { page, setPage, isActive, stepIndex, stepCount, skip } = useDemoTour();

  return (
    <div className="ai11y-shell">
      <nav className="ai11y-sidebar">
        <div className="ai11y-titlebar-drag" />
        <Sidebar current={page} onNavigate={setPage} />
      </nav>
      <main className="ai11y-page-content">
        {isActive && (
          <div className="ai11y-tour-banner">
            <Label color="blue">
              Product tour {stepIndex + 1}/{stepCount}
            </Label>
            <Button variant="link" isInline onClick={skip}>
              Exit tour
            </Button>
          </div>
        )}
        <PageSlot visible={page === "ide"}>
          <IDEAuditor title={pageTitles.ide} />
        </PageSlot>
        <PageSlot visible={page === "browser"}>
          <BrowserAuditor title={pageTitles.browser} />
        </PageSlot>
        <PageSlot visible={page === "setup"}>
          <Setup title={pageTitles.setup} />
        </PageSlot>
      </main>
      <ProductTour />
    </div>
  );
}

export default function App() {
  return (
    <DemoTourProvider>
      <AppShell />
    </DemoTourProvider>
  );
}
