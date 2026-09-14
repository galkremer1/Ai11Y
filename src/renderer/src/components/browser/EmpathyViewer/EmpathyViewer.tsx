import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardBody,
  Spinner,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { Placeholder } from "./Placeholder";
import type { ElectronWebviewElement } from "../../../webview";

export interface EmpathyViewerHandle {
  goBack(): void;
  goForward(): void;
  reload(): void;
}

export interface PreviewNavState {
  canGoBack: boolean;
  canGoForward: boolean;
}

interface EmpathyViewerProps {
  filter: string;
  url: string;
  onPreviewReady?: (ready: boolean) => void;
  onLocationChange?: (url: string) => void;
  onNavStateChange?: (state: PreviewNavState) => void;
}

const filterStyles: Record<string, string> = {
  none: "",
  protanopia: "grayscale(20%) sepia(40%) saturate(300%) hue-rotate(-10deg)",
  deuteranopia: "grayscale(20%) sepia(30%) saturate(250%) hue-rotate(30deg)",
  tritanopia: "grayscale(20%) sepia(50%) saturate(200%) hue-rotate(180deg)",
  achromatopsia: "grayscale(100%)",
  "low-vision": "blur(2px) contrast(70%)",
};

function isElectronPreview(): boolean {
  return typeof window !== "undefined" && typeof window.api !== "undefined";
}

function sameUrl(a: string, b: string): boolean {
  if (a === b) return true;
  try {
    const left = new URL(a);
    const right = new URL(b);
    const path = (value: string) =>
      value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;
    return (
      left.origin === right.origin &&
      path(left.pathname) === path(right.pathname) &&
      left.search === right.search &&
      left.hash === right.hash
    );
  } catch {
    return a.replace(/\/$/, "") === b.replace(/\/$/, "");
  }
}

export const EmpathyViewer = forwardRef<
  EmpathyViewerHandle,
  EmpathyViewerProps
>(function EmpathyViewer(
  { filter, url, onPreviewReady, onLocationChange, onNavStateChange },
  ref,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [webviewEl, setWebviewEl] = useState<ElectronWebviewElement | null>(
    null,
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadedUrlRef = useRef("");
  const skipInitialWebviewLoad = useRef(true);
  const iframeStack = useRef<string[]>([]);
  const iframeIndex = useRef(-1);
  const webviewSrcRef = useRef("");
  const hasUrl = url.trim().length > 0;
  const useWebview = isElectronPreview();

  if (!hasUrl) {
    webviewSrcRef.current = "";
  } else if (!webviewSrcRef.current) {
    webviewSrcRef.current = url.trim();
  }

  const emitIframeNavState = useCallback(() => {
    onNavStateChange?.({
      canGoBack: iframeIndex.current > 0,
      canGoForward: iframeIndex.current < iframeStack.current.length - 1,
    });
  }, [onNavStateChange]);

  const emitWebviewNavState = useCallback(
    (el: ElectronWebviewElement) => {
      onNavStateChange?.({
        canGoBack: el.canGoBack(),
        canGoForward: el.canGoForward(),
      });
    },
    [onNavStateChange],
  );

  const pushIframeUrl = useCallback(
    (next: string) => {
      const stack = iframeStack.current.slice(0, iframeIndex.current + 1);
      const last = stack[stack.length - 1];
      if (last && sameUrl(last, next)) {
        emitIframeNavState();
        return;
      }
      stack.push(next);
      iframeStack.current = stack;
      iframeIndex.current = stack.length - 1;
      emitIframeNavState();
    },
    [emitIframeNavState],
  );

  useEffect(() => {
    if (!hasUrl) {
      onPreviewReady?.(false);
      onNavStateChange?.({ canGoBack: false, canGoForward: false });
      loadedUrlRef.current = "";
      skipInitialWebviewLoad.current = true;
      iframeStack.current = [];
      iframeIndex.current = -1;
    }
  }, [hasUrl, onPreviewReady, onNavStateChange]);

  useEffect(() => {
    if (!hasUrl) return;
    const next = url.trim();
    if (sameUrl(loadedUrlRef.current, next)) return;
    loadedUrlRef.current = next;
    setLoading(true);
    setError(false);
    onPreviewReady?.(false);

    if (useWebview) {
      if (skipInitialWebviewLoad.current) {
        skipInitialWebviewLoad.current = false;
        return;
      }
      if (webviewEl && !sameUrl(webviewEl.getURL() || "", next)) {
        webviewEl.src = next;
      }
      return;
    }

    pushIframeUrl(next);
    const frame = iframeRef.current;
    if (frame && frame.src !== next) {
      frame.src = next;
    }
  }, [hasUrl, url, useWebview, webviewEl, onPreviewReady, pushIframeUrl]);

  useEffect(() => {
    if (!hasUrl || !useWebview) return;

    const el = webviewEl;
    if (!el) return;

    let mainFrameFailed = false;

    const onStop = (): void => {
      setLoading(false);
      if (!mainFrameFailed) {
        setError(false);
        onPreviewReady?.(true);
      }
      const loc = el.getURL();
      if (loc) {
        loadedUrlRef.current = loc;
        onLocationChange?.(loc);
      }
      emitWebviewNavState(el);
    };
    const onFail = (event: Event): void => {
      const detail = event as Event & {
        isMainFrame?: boolean;
        errorCode?: number;
      };
      if (detail.isMainFrame === false) return;
      if (detail.errorCode === -3) return;
      mainFrameFailed = true;
      setLoading(false);
      setError(true);
      onPreviewReady?.(false);
    };
    const onIpcMessage = (event: Event): void => {
      const detail = event as Event & { channel?: string; args?: unknown[] };
      if (detail.channel !== "ai11y:screen-reader") return;
      const payload = detail.args?.[0];
      if (payload && typeof payload === "object") {
        window.postMessage(payload, "*");
      }
    };
    const onNavigate = (): void => {
      const loc = el.getURL();
      if (loc) {
        loadedUrlRef.current = loc;
        onLocationChange?.(loc);
      }
      emitWebviewNavState(el);
    };

    el.addEventListener("did-stop-loading", onStop);
    el.addEventListener("did-fail-load", onFail);
    el.addEventListener("ipc-message", onIpcMessage);
    el.addEventListener("did-navigate", onNavigate);
    el.addEventListener("did-navigate-in-page", onNavigate);
    return () => {
      el.removeEventListener("did-stop-loading", onStop);
      el.removeEventListener("did-fail-load", onFail);
      el.removeEventListener("ipc-message", onIpcMessage);
      el.removeEventListener("did-navigate", onNavigate);
      el.removeEventListener("did-navigate-in-page", onNavigate);
    };
  }, [
    hasUrl,
    url,
    useWebview,
    onPreviewReady,
    webviewEl,
    onLocationChange,
    emitWebviewNavState,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      goBack() {
        if (useWebview && webviewEl?.canGoBack()) {
          webviewEl.goBack();
          return;
        }
        if (iframeIndex.current > 0) {
          iframeIndex.current -= 1;
          const target = iframeStack.current[iframeIndex.current];
          if (!target) return;
          loadedUrlRef.current = target;
          setLoading(true);
          const frame = iframeRef.current;
          if (frame) frame.src = target;
          onLocationChange?.(target);
          emitIframeNavState();
        }
      },
      goForward() {
        if (useWebview && webviewEl?.canGoForward()) {
          webviewEl.goForward();
          return;
        }
        if (iframeIndex.current < iframeStack.current.length - 1) {
          iframeIndex.current += 1;
          const target = iframeStack.current[iframeIndex.current];
          if (!target) return;
          loadedUrlRef.current = target;
          setLoading(true);
          const frame = iframeRef.current;
          if (frame) frame.src = target;
          onLocationChange?.(target);
          emitIframeNavState();
        }
      },
      reload() {
        setLoading(true);
        setError(false);
        onPreviewReady?.(false);
        if (useWebview && webviewEl) {
          webviewEl.reload();
          return;
        }
        const frame = iframeRef.current;
        const current =
          iframeStack.current[iframeIndex.current] || url.trim();
        if (!frame || !current) return;
        try {
          frame.contentWindow?.location.reload();
        } catch {
          frame.src = current;
        }
      },
    }),
    [
      useWebview,
      webviewEl,
      url,
      onLocationChange,
      onPreviewReady,
      emitIframeNavState,
    ],
  );

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
        {useWebview ? (
          <webview
            ref={(el) => {
              setWebviewEl((el as ElectronWebviewElement | null) ?? null);
            }}
            src={webviewSrcRef.current || url.trim()}
            className="ai11y-empathy-iframe"
            allowpopups={true}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={url.trim()}
            className="ai11y-empathy-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Empathy viewer – audited page"
            onLoad={() => {
              setLoading(false);
              setError(false);
              onPreviewReady?.(true);
              const frame = iframeRef.current;
              try {
                const loc = frame?.contentWindow?.location.href;
                if (loc && loc !== "about:blank") {
                  loadedUrlRef.current = loc;
                  pushIframeUrl(loc);
                  onLocationChange?.(loc);
                } else {
                  emitIframeNavState();
                }
              } catch {
                emitIframeNavState();
              }
            }}
            onError={() => {
              setLoading(false);
              setError(true);
              onPreviewReady?.(false);
            }}
          />
        )}
      </CardBody>
    </Card>
  );
});
