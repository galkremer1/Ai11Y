import { useState } from "react";
import {
  Card,
  CardBody,
  Spinner,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { Placeholder } from "./Placeholder";

interface EmpathyViewerProps {
  filter: string;
  url: string;
}

export function EmpathyViewer({ filter, url }: EmpathyViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filterStyles: Record<string, string> = {
    none: "",
    protanopia: "grayscale(20%) sepia(40%) saturate(300%) hue-rotate(-10deg)",
    deuteranopia: "grayscale(20%) sepia(30%) saturate(250%) hue-rotate(30deg)",
    tritanopia: "grayscale(20%) sepia(50%) saturate(200%) hue-rotate(180deg)",
    achromatopsia: "grayscale(100%)",
    "low-vision": "blur(2px) contrast(70%)",
  };

  const hasUrl = url.trim().length > 0;

  if (!hasUrl) {
    return (
      <Card isFullHeight style={{ filter: filterStyles[filter] || "" }}>
        <CardBody
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Placeholder />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card isFullHeight style={{ filter: filterStyles[filter] || "" }}>
      <CardBody
        style={{
          padding: 0,
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              backgroundColor:
                "var(--pf-t--global--background--color--primary--default)",
            }}
          >
            <Spinner aria-label="Loading page" />
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              backgroundColor:
                "var(--pf-t--global--background--color--primary--default)",
            }}
          >
            <EmptyState
              titleText="Page failed to load"
              icon={ExclamationCircleIcon}
              headingLevel="h4"
              status="danger"
            >
              <EmptyStateBody>
                The page could not be loaded in the viewer.
              </EmptyStateBody>
            </EmptyState>
          </div>
        )}
        <iframe
          key={url}
          src={url.trim()}
          className="ai11y-empathy-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Empathy viewer – audited page"
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </CardBody>
    </Card>
  );
}
