import { useCallback } from "react";
import { useApi } from "../services/ApiProvider";
import type { EslintRunRequest } from "@shared/schemas/eslint.schemas";
import type { AnalyzeCodeRequest } from "@shared/schemas/ai-analysis.schemas";
import type {
  FileTreeRequest,
  FileReadRequest,
  FileWriteRequest,
} from "@shared/schemas/filesystem.schemas";

export function useIdeServices() {
  const api = useApi();

  const selectDirectory = useCallback(() => api.selectDirectory(), [api]);
  const runEslint = useCallback(
    (request: EslintRunRequest) => api.runEslint(request),
    [api],
  );
  const analyzeCode = useCallback(
    (request: AnalyzeCodeRequest) => api.analyzeCode(request),
    [api],
  );
  const readFileTree = useCallback(
    (request: FileTreeRequest) => api.readFileTree(request),
    [api],
  );
  const readFile = useCallback(
    (request: FileReadRequest) => api.readFile(request),
    [api],
  );
  const writeFile = useCallback(
    (request: FileWriteRequest) => api.writeFile(request),
    [api],
  );

  return {
    selectDirectory,
    runEslint,
    analyzeCode,
    readFileTree,
    readFile,
    writeFile,
  };
}
