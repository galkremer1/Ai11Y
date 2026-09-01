import { createTool } from "@mastra/core/tools";
import {
  AxeAuditRequestSchema,
  AxeAuditResponseSchema,
} from "../../../shared/schemas/axe.schemas";

export const axeCoreTool = createTool({
  id: "axe-core-audit",
  description:
    "Run Axe-Core accessibility audit against a URL using Playwright",
  inputSchema: AxeAuditRequestSchema,
  outputSchema: AxeAuditResponseSchema,
  execute: async ({ context }) => {
    // Placeholder: will integrate @axe-core/playwright in a future phase
    console.log(`[axe-core-tool] Would audit: ${context.url}`);
    return { violations: [] };
  },
});
