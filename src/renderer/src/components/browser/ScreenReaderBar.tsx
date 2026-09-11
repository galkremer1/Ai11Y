import { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@patternfly/react-icons/dist/esm/icons/volume-up-icon";

interface ScreenReaderAnnouncement {
  role: string;
  name: string | null;
  tag: string;
  href: string | null;
  level: number | null;
  inputType: string | null;
  hasComputed: boolean;
}

interface ScreenReaderBarProps {
  screenReaderOn: boolean;
  url: string;
}

function formatAnnouncement(a: ScreenReaderAnnouncement): string {
  const parts: string[] = [];

  if (a.role === "heading" && a.level) {
    parts.push(`heading level ${a.level}`);
  } else {
    parts.push(a.role);
  }

  if (a.name) {
    parts.push(`"${a.name}"`);
  } else {
    parts.push("(no accessible name)");
  }

  return parts.join(": ");
}

function formatDetails(a: ScreenReaderAnnouncement): string {
  const parts: string[] = [`<${a.tag}>`];

  if (a.href) {
    parts.push(`href="${a.href}"`);
  }
  if (a.inputType) {
    parts.push(`type="${a.inputType}"`);
  }
  if (a.hasComputed) {
    parts.push("(computed)");
  }

  return parts.join(" ");
}

export function ScreenReaderBar({ screenReaderOn, url }: ScreenReaderBarProps) {
  const [announcement, setAnnouncement] =
    useState<ScreenReaderAnnouncement | null>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!screenReaderOn || !url.trim()) {
      setAnnouncement(null);
      injectedRef.current = false;
      speechSynthesis.cancel();
      return;
    }

    function handleMessage(e: MessageEvent): void {
      if (e.data?.type !== "ai11y:screen-reader") return;
      const data = e.data as ScreenReaderAnnouncement & { type: string };
      const a: ScreenReaderAnnouncement = {
        role: data.role,
        name: data.name,
        tag: data.tag,
        href: data.href,
        level: data.level,
        inputType: data.inputType,
        hasComputed: data.hasComputed,
      };
      setAnnouncement(a);

      speechSynthesis.cancel();
      const text = formatAnnouncement(a);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      speechSynthesis.speak(utterance);
    }

    window.addEventListener("message", handleMessage);

    if (!injectedRef.current) {
      injectedRef.current = true;
      window.api.injectScreenReader();
    }

    return () => {
      window.removeEventListener("message", handleMessage);
      speechSynthesis.cancel();
    };
  }, [screenReaderOn, url]);

  if (!screenReaderOn || !url.trim()) return null;

  const hasName = announcement?.name != null && announcement.name.length > 0;

  return (
    <div className="ai11y-screen-reader-bar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--pf-t--global--spacer--sm)",
        }}
      >
        <VolumeUpIcon />
        {announcement ? (
          <span>
            <strong>{announcement.role}</strong>
            {announcement.role === "heading" && announcement.level
              ? ` level ${announcement.level}`
              : ""}
            {": "}
            {hasName ? (
              <span>&quot;{announcement.name}&quot;</span>
            ) : (
              <span
                style={{
                  color:
                    "var(--pf-t--global--color--status--danger--default)",
                }}
              >
                (no accessible name)
              </span>
            )}
          </span>
        ) : (
          <span
            style={{
              color: "var(--pf-t--global--text--color--subtle)",
              fontStyle: "italic",
            }}
          >
            Tab through the page to hear screen reader announcements
          </span>
        )}
      </div>
      {announcement && (
        <div
          style={{
            fontSize: "var(--pf-t--global--font--size--xs)",
            color: "var(--pf-t--global--text--color--subtle)",
            marginTop: 2,
          }}
        >
          {formatDetails(announcement)}
        </div>
      )}
    </div>
  );
}
