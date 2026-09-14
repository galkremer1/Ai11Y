import { useState, useEffect, useMemo } from "react";
import {
  TreeView,
  type TreeViewDataItem,
  Spinner,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import FolderIcon from "@patternfly/react-icons/dist/esm/icons/folder-icon";
import FolderOpenIcon from "@patternfly/react-icons/dist/esm/icons/folder-open-icon";
import type { FileTreeNode } from "@shared/schemas/filesystem.schemas";

interface FileTreeProps {
  root: FileTreeNode | null;
  loading?: boolean;
  selectedFilePath?: string | null;
  onFileSelect?: (filePath: string) => void;
}

function toTreeViewData(
  nodes: FileTreeNode[],
  parentKey = "",
): TreeViewDataItem[] {
  return nodes.map((node) => {
    const key = node.path || `${parentKey}/${node.name}`;
    const item: TreeViewDataItem = {
      name: node.name,
      id: key,
    };

    if (node.type === "directory") {
      item.icon = <FolderIcon />;
      item.expandedIcon = <FolderOpenIcon />;
      if (node.children?.length) {
        item.children = toTreeViewData(node.children, key);
      }
      item.defaultExpanded = true;
    }

    return item;
  });
}

function findItemPath(
  items: TreeViewDataItem[],
  targetId: string,
): TreeViewDataItem[] {
  for (const item of items) {
    if (item.id === targetId) return [item];
    if (item.children) {
      const childPath = findItemPath(item.children, targetId);
      if (childPath.length) return [item, ...childPath];
    }
  }
  return [];
}

function findNodeByPath(
  node: FileTreeNode,
  filePath: string,
): FileTreeNode | null {
  if (node.path === filePath) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByPath(child, filePath);
      if (found) return found;
    }
  }
  return null;
}

export function FileTree({
  root,
  loading = false,
  selectedFilePath,
  onFileSelect,
}: FileTreeProps) {
  const treeData = useMemo(
    () => (root?.children ? toTreeViewData(root.children) : []),
    [root],
  );
  const [activeItems, setActiveItems] = useState<TreeViewDataItem[]>([]);

  useEffect(() => {
    if (!selectedFilePath || !root) return;
    const node = findNodeByPath(root, selectedFilePath);
    if (node?.type !== "file") return;
    const path = findItemPath(treeData, selectedFilePath);
    if (path.length) setActiveItems(path);
  }, [selectedFilePath, root, treeData]);

  const handleSelect = (_event: React.MouseEvent, item: TreeViewDataItem) => {
    if (!item.id || !root) return;

    const node = findNodeByPath(root, item.id);
    if (node?.type !== "file") return;

    setActiveItems(findItemPath(treeData, item.id));
    onFileSelect?.(item.id);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "var(--pf-t--global--spacer--lg)",
        }}
      >
        <Spinner size="lg" aria-label="Loading file tree" />
      </div>
    );
  }

  if (!root) {
    return (
      <EmptyState>
        <EmptyStateBody>Select a directory to browse project files.</EmptyStateBody>
      </EmptyState>
    );
  }

  if (!treeData.length) {
    return (
      <EmptyState>
        <EmptyStateBody>No files found in this directory.</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <TreeView
      data={treeData}
      activeItems={activeItems}
      onSelect={handleSelect}
      aria-label="Project files"
    />
  );
}
