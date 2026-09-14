import { BrowserWindow } from "electron";
import { createRequire } from "module";
import { readFile } from "fs/promises";
import type { AxeResults, NodeResult } from "axe-core";
import type { AxeViolation } from "../shared/schemas/axe.schemas";

const LOAD_TIMEOUT_MS = 30_000;
const IMPACTS = ["minor", "moderate", "serious", "critical"] as const;
type Impact = (typeof IMPACTS)[number];

const require = createRequire(import.meta.url);

function isImpact(value: string | null | undefined): value is Impact {
  return IMPACTS.includes(value as Impact);
}

function stringifyTarget(target: NodeResult["target"]): string[] {
  return target.map((entry) =>
    typeof entry === "string" ? entry : JSON.stringify(entry),
  );
}

export function mapAxeResults(results: AxeResults): AxeViolation[] {
  return results.violations.flatMap((violation) => {
    if (!isImpact(violation.impact)) return [];
    return [
      {
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => ({
          html: node.html,
          target: stringifyTarget(node.target),
          failureSummary: node.failureSummary ?? "",
        })),
      },
    ];
  });
}

function loadUrl(win: BrowserWindow, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out loading ${url}`));
    }, LOAD_TIMEOUT_MS);

    const onFail = (
      _event: Electron.Event,
      errorCode: number,
      errorDescription: string,
      _validatedURL: string,
      isMainFrame: boolean,
    ): void => {
      if (!isMainFrame) return;
      // -3 ERR_ABORTED can fire on redirects; ignore it
      if (errorCode === -3) return;
      cleanup();
      reject(new Error(`Failed to load ${url}: ${errorDescription}`));
    };

    const onFinish = (): void => {
      cleanup();
      resolve();
    };

    function cleanup(): void {
      clearTimeout(timer);
      win.webContents.removeListener("did-fail-load", onFail);
      win.webContents.removeListener("did-finish-load", onFinish);
    }

    win.webContents.on("did-fail-load", onFail);
    win.webContents.once("did-finish-load", onFinish);

    win.loadURL(url).catch((err: unknown) => {
      cleanup();
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
}

export async function runAxeAudit(url: string): Promise<AxeViolation[]> {
  const win = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    skipTaskbar: true,
    webPreferences: {
      offscreen: true,
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  try {
    await loadUrl(win, url);

    const axePath = require.resolve("axe-core/axe.min.js");
    const axeSource = await readFile(axePath, "utf-8");
    await win.webContents.executeJavaScript(axeSource);
    const results = (await win.webContents.executeJavaScript(
      "axe.run()",
    )) as AxeResults;
    return mapAxeResults(results);
  } finally {
    if (!win.isDestroyed()) {
      win.destroy();
    }
  }
}
