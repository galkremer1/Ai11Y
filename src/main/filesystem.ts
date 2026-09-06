import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join } from "path";
import type { FileTreeNode } from "../shared/schemas/filesystem.schemas";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  "out",
  "dist",
  "dist-electron",
  "build",
  "release",
]);

async function buildFileTree(dirPath: string): Promise<FileTreeNode> {
  const name = dirPath.split("/").pop() || dirPath;
  const entries = await readdir(dirPath, { withFileTypes: true });
  const children: FileTreeNode[] = [];

  const sorted = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of sorted) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      children.push(await buildFileTree(fullPath));
    } else if (entry.isFile()) {
      children.push({
        name: entry.name,
        path: fullPath,
        type: "file",
      });
    }
  }

  return {
    name,
    path: dirPath,
    type: "directory",
    children,
  };
}

export async function readDirectoryTree(
  directory: string,
): Promise<FileTreeNode> {
  const dirStat = await stat(directory);
  if (!dirStat.isDirectory()) {
    throw new Error(`Path is not a directory: ${directory}`);
  }
  return buildFileTree(directory);
}

export async function readFileContent(filePath: string): Promise<string> {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }
  return readFile(filePath, "utf-8");
}

export async function writeFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  await writeFile(filePath, content, "utf-8");
}
