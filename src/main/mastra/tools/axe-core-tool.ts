import { createTool } from "@mastra/core/tools";
import {
  AxeAuditRequestSchema,
  AxeAuditResponseSchema,
} from "../../../shared/schemas/axe.schemas";
import { runAxeAudit } from "../../axe-audit";

export const axeCoreTool = createTool({
  id: "axe-core-audit",
  description:
    "Run Axe-Core accessibility audit against a URL in a hidden BrowserWindow",
  inputSchema: AxeAuditRequestSchema,
  outputSchema: AxeAuditResponseSchema,
  execute: async ({ context }) => {
    const violations = await runAxeAudit(context.url);
    return { violations };
  },
});
