import { useCallback } from "react";
import { useApi } from "../services/ApiProvider";
import type { AxeAuditRequest } from "@shared/schemas/axe.schemas";
import type { AnalyzeHtmlRequest } from "@shared/schemas/ai-analysis.schemas";

export function useBrowserServices() {
  const api = useApi();

  const runAxeAudit = useCallback(
    (request: AxeAuditRequest) => api.runAxeAudit(request),
    [api],
  );
  const analyzeHtml = useCallback(
    (request: AnalyzeHtmlRequest) => api.analyzeHtml(request),
    [api],
  );

  return { runAxeAudit, analyzeHtml };
}
