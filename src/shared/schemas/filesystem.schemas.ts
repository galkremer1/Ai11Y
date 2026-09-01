import { z } from "zod";

export const FileTreeNodeSchema: z.ZodType<FileTreeNode> = z.lazy(() =>
  z.object({
    name: z.string(),
    path: z.string(),
    type: z.enum(["file", "directory"]),
    children: z.array(FileTreeNodeSchema).optional(),
  }),
);
export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

export const FileTreeRequestSchema = z.object({
  directory: z.string().describe("Absolute path to the directory to read"),
});
export type FileTreeRequest = z.infer<typeof FileTreeRequestSchema>;

export const FileTreeResponseSchema = z.object({
  root: FileTreeNodeSchema,
});
export type FileTreeResponse = z.infer<typeof FileTreeResponseSchema>;

export const FileReadRequestSchema = z.object({
  filePath: z.string().describe("Absolute path to the file to read"),
});
export type FileReadRequest = z.infer<typeof FileReadRequestSchema>;

export const FileReadResponseSchema = z.object({
  content: z.string(),
  filePath: z.string(),
});
export type FileReadResponse = z.infer<typeof FileReadResponseSchema>;

export const FileWriteRequestSchema = z.object({
  filePath: z.string().describe("Absolute path to the file to write"),
  content: z.string(),
});
export type FileWriteRequest = z.infer<typeof FileWriteRequestSchema>;
