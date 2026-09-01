import { createContext, useContext } from "react";
import type { IpcApi } from "@shared/types/ipc-api";

const ApiContext = createContext<IpcApi | null>(null);

export function ApiProvider({
  api,
  children,
}: {
  api: IpcApi;
  children: React.ReactNode;
}) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): IpcApi {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error("useApi must be used within an <ApiProvider>");
  }
  return api;
}
