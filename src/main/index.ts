import { app, BrowserWindow, session, shell } from "electron";
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { registerIpcHandlers } from "./ipc-handlers";

app.commandLine.appendSwitch(
  "enable-blink-features",
  "ComputedAccessibilityInfo",
);

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: "#09090b",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // Strip frame-blocking headers so the empathy viewer iframe can load any site
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders };
    delete headers["x-frame-options"];
    delete headers["X-Frame-Options"];
    if (headers["content-security-policy"]) {
      headers["content-security-policy"] = headers[
        "content-security-policy"
      ].map((csp) => csp.replace(/frame-ancestors\s+[^;]*(;|$)/gi, "$1"));
    }
    callback({ responseHeaders: headers });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-attach-webview", (_event, webPreferences) => {
    webPreferences.preload = join(__dirname, "../preload/webview.js");
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
