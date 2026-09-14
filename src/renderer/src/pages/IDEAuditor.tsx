import { useState, useCallback, useEffect } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Split,
  SplitItem,
  Alert,
  AlertVariant,
  Tooltip,
} from "@patternfly/react-core";
import FolderOpenIcon from "@patternfly/react-icons/dist/esm/icons/folder-open-icon";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import PlayIcon from "@patternfly/react-icons/dist/esm/icons/play-icon";
import WrenchIcon from "@patternfly/react-icons/dist/esm/icons/wrench-icon";
import { TopBar } from "../components/layout/TopBar";
import { FileTree } from "../components/ide/FileTree";
import { CodeEditor } from "../components/ide/CodeEditor";
import { DiffViewer } from "../components/ide/DiffViewer";
import { A11yConsole } from "../components/ide/A11yConsole";
import { AuditResultAlert } from "../components/ide/AuditResultAlert";
import { useIdeServices } from "../hooks/useIdeServices";
import { languageFromPath } from "../utils/languageFromPath";
import { getFixedCodeFromResponse } from "../utils/getFixedCodeFromResponse";
import type { FileTreeNode } from "@shared/schemas/filesystem.schemas";
import type { EslintError } from "@shared/schemas/eslint.schemas";
import { useDemoTour } from "../tour/DemoTourProvider";
import {
  TOUR_DEMO_DIRECTORY,
  TOUR_DEMO_ESLINT,
  TOUR_DEMO_FILES,
  TOUR_DEMO_LOGIN,
  TOUR_DEMO_TREE,
  isTourDemoDirectory,
  isTourDemoPath,
} from "../tour/tour-demo";

interface IDEAuditorProps {
  title: string;
}

export function IDEAuditor({ title }: IDEAuditorProps) {
  const {
    selectDirectory,
    readFileTree,
    readFile,
    writeFile,
    runEslint,
    analyzeCode,
  } = useIdeServices();
  const { tourSession } = useDemoTour();

  const [directory, setDirectory] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);
  const [treeLoading, setTreeLoading] = useState(false);

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [fileLoading, setFileLoading] = useState(false);

  const [eslintErrors, setEslintErrors] = useState<EslintError[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [hasRunAudit, setHasRunAudit] = useState(false);

  const [showDiff, setShowDiff] = useState(false);
  const [fixedCode, setFixedCode] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const applyTourSample = useCallback(() => {
    setDirectory(TOUR_DEMO_DIRECTORY);
    setFileTree(TOUR_DEMO_TREE);
    setSelectedFilePath(TOUR_DEMO_LOGIN);
    setCode(TOUR_DEMO_FILES[TOUR_DEMO_LOGIN] ?? "");
    setLanguage(languageFromPath(TOUR_DEMO_LOGIN));
    setEslintErrors(TOUR_DEMO_ESLINT);
    setHasRunAudit(true);
    setShowDiff(false);
    setFixedCode("");
    setError(null);
    setTreeLoading(false);
    setFileLoading(false);
  }, []);

  useEffect(() => {
    if (tourSession === 0) return;
    applyTourSample();
  }, [tourSession, applyTourSample]);

  const loadFileTree = useCallback(
    async (dir: string) => {
      setTreeLoading(true);
      setError(null);
      const result = await readFileTree({ directory: dir });
      setTreeLoading(false);

      if (!result.ok) {
        setError(result.error);
        setFileTree(null);
        return;
      }

      setFileTree(result.data.root);
    },
    [readFileTree],
  );

  const handleSelectDir = async () => {
    const dir = await selectDirectory();
    if (!dir) return;

    setDirectory(dir);
    setSelectedFilePath(null);
    setCode("");
    setLanguage("plaintext");
    setEslintErrors([]);
    setHasRunAudit(false);
    setShowDiff(false);
    setFixedCode("");
    await loadFileTree(dir);
  };

  const handleFileSelect = async (filePath: string) => {
    setFileLoading(true);
    setError(null);
    setSelectedFilePath(filePath);
    setShowDiff(false);
    setFixedCode("");

    if (isTourDemoPath(filePath)) {
      const content = TOUR_DEMO_FILES[filePath] ?? "";
      setCode(content);
      setLanguage(languageFromPath(filePath));
      setFileLoading(false);
      return;
    }

    const result = await readFile({ filePath });
    setFileLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setCode(result.data.content);
    setLanguage(languageFromPath(filePath));
  };

  const handleRunAudit = async () => {
    if (!directory) return;

    if (isTourDemoDirectory(directory)) {
      setEslintErrors(TOUR_DEMO_ESLINT);
      setHasRunAudit(true);
      setError(null);
      return;
    }

    setAuditLoading(true);
    setError(null);
    const result = await runEslint({ directory });
    setAuditLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setEslintErrors(result.data.errors);
    setHasRunAudit(true);
  };

  const handleAiFix = async () => {
    if (!selectedFilePath || !code) return;

    setAiLoading(true);
    setError(null);
    const result = await analyzeCode({
      code,
      language,
      filePath: selectedFilePath,
    });
    setAiLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const fixed = getFixedCodeFromResponse(code, result.data);
    setFixedCode(fixed);
    setShowDiff(true);
  };

  const handleAcceptFix = async () => {
    if (!selectedFilePath || !fixedCode) return;

    if (isTourDemoPath(selectedFilePath)) {
      setCode(fixedCode);
      setShowDiff(false);
      setFixedCode("");
      return;
    }

    setSaveLoading(true);
    setError(null);
    const result = await writeFile({
      filePath: selectedFilePath,
      content: fixedCode,
    });
    setSaveLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setCode(fixedCode);
    setShowDiff(false);
    setFixedCode("");
  };

  const filteredErrors = selectedFilePath
    ? eslintErrors.filter((err) => err.file === selectedFilePath)
    : eslintErrors;

  return (
    <>
      <TopBar title={title} />
      {error && (
        <Alert
          variant={AlertVariant.danger}
          title={error}
          isInline
          style={{ margin: "8px" }}
        />
      )}
      {hasRunAudit && (
        <AuditResultAlert
          allErrors={eslintErrors}
          selectedFilePath={selectedFilePath}
          projectDirectory={directory}
          onFileSelect={handleFileSelect}
        />
      )}
      <Toolbar style={{ padding: "8px" }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button
              variant="secondary"
              icon={<FolderOpenIcon />}
              onClick={handleSelectDir}
              data-tour="ide-select-dir"
            >
              {directory ? directory : "Select Directory"}
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="primary"
              icon={<PlayIcon />}
              onClick={handleRunAudit}
              isDisabled={!directory}
              isLoading={auditLoading}
              data-tour="ide-run-audit"
            >
              Run Audit
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="secondary"
              icon={<WrenchIcon />}
              onClick={handleAiFix}
              isDisabled={!selectedFilePath || !code}
              isLoading={aiLoading}
              data-tour="ide-ai-fix"
            >
              AI Fix
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Tooltip
              content="Show Diff is only available after generating an AI Fix for the open file"
              trigger={!fixedCode ? "mouseenter focus" : "manual"}
              isVisible={!fixedCode ? undefined : false}
            >
              <Button
                variant={showDiff ? "primary" : "secondary"}
                onClick={() => setShowDiff(!showDiff)}
                isDisabled={!fixedCode}
              >
                {showDiff ? "Show Editor" : "Show Diff"}
              </Button>
            </Tooltip>
          </ToolbarItem>
          {showDiff && (
            <ToolbarItem>
              <Button
                variant="primary"
                icon={<CheckIcon />}
                onClick={handleAcceptFix}
                isLoading={saveLoading}
              >
                Accept AI Fix
              </Button>
            </ToolbarItem>
          )}
        </ToolbarContent>
      </Toolbar>
      <Split style={{ flex: 1, overflow: "hidden" }}>
        <SplitItem className="ai11y-file-tree">
          <FileTree
            root={fileTree}
            loading={treeLoading}
            selectedFilePath={selectedFilePath}
            onFileSelect={handleFileSelect}
          />
        </SplitItem>
        <SplitItem
          isFilled
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div className="ai11y-editor-panel">
            {fileLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                Loading file...
              </div>
            ) : showDiff && fixedCode ? (
              <DiffViewer
                original={code}
                modified={fixedCode}
                language={language}
              />
            ) : selectedFilePath ? (
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--pf-t--global--text--color--subtle)",
                }}
              >
                Select a file from the tree to view its contents
              </div>
            )}
          </div>
          <div
            className="ai11y-console"
            style={{
              borderTop:
                "1px solid var(--pf-t--global--border--color--default)",
            }}
          >
            <A11yConsole
              errors={filteredErrors}
              hasRunAudit={hasRunAudit}
              selectedFilePath={selectedFilePath}
              totalProjectErrors={eslintErrors.length}
              allErrors={eslintErrors}
              projectDirectory={directory}
            />
          </div>
        </SplitItem>
      </Split>
    </>
  );
}
