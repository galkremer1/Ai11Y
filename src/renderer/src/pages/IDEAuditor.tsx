import { useState } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import FolderOpenIcon from "@patternfly/react-icons/dist/esm/icons/folder-open-icon";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import { TopBar } from "../components/layout/TopBar";
import { FileTree } from "../components/ide/FileTree";
import { CodeEditor } from "../components/ide/CodeEditor";
import { DiffViewer } from "../components/ide/DiffViewer";
import { A11yConsole } from "../components/ide/A11yConsole";
import { mockEslintErrors } from "../mocks/eslint-errors";
import { originalCode, fixedCode } from "../mocks/sample-code";
import { useIpc } from "../hooks/useIpc";

interface IDEAuditorProps {
  title: string;
}

export function IDEAuditor({ title }: IDEAuditorProps) {
  const { selectDirectory } = useIpc();
  const [code, setCode] = useState(originalCode);
  const [showDiff, setShowDiff] = useState(false);
  const [directory, setDirectory] = useState<string | null>(null);

  const handleSelectDir = async () => {
    const dir = await selectDirectory();
    if (dir) setDirectory(dir);
  };

  const handleAcceptFix = () => {
    setCode(fixedCode);
    setShowDiff(false);
  };

  return (
    <>
      <TopBar title={title} />
      <Toolbar style={{ padding: "8px" }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button
              variant="secondary"
              icon={<FolderOpenIcon />}
              onClick={handleSelectDir}
            >
              {directory ? directory : "Select Directory"}
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant={showDiff ? "primary" : "secondary"}
              onClick={() => setShowDiff(!showDiff)}
            >
              {showDiff ? "Show Editor" : "Show Diff"}
            </Button>
          </ToolbarItem>
          {showDiff && (
            <ToolbarItem>
              <Button
                variant="primary"
                icon={<CheckIcon />}
                onClick={handleAcceptFix}
              >
                Accept AI Fix
              </Button>
            </ToolbarItem>
          )}
        </ToolbarContent>
      </Toolbar>
      <Split style={{ flex: 1, overflow: "hidden" }}>
        <SplitItem className="ai11y-file-tree">
          <FileTree />
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
            {showDiff ? (
              <DiffViewer
                original={originalCode}
                modified={fixedCode}
                language="typescriptreact"
              />
            ) : (
              <CodeEditor
                value={code}
                onChange={setCode}
                language="typescriptreact"
              />
            )}
          </div>
          <div
            className="ai11y-console"
            style={{
              borderTop:
                "1px solid var(--pf-t--global--border--color--default)",
            }}
          >
            <A11yConsole errors={mockEslintErrors} />
          </div>
        </SplitItem>
      </Split>
    </>
  );
}
