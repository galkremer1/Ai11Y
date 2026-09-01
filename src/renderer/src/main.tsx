import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/main.css";
import { ApiProvider } from "./services/ApiProvider";
import { mockIpcApi } from "@shared/mocks/mock-ipc-api";
import type { IpcApi } from "@shared/types/ipc-api";

const api: IpcApi = window.api ?? mockIpcApi;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider api={api}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);
