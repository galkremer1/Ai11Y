import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const eslintTool = createTool({
  id: 'eslint-a11y-lint',
  description: 'Run eslint-plugin-jsx-a11y against a directory of source files',
  inputSchema: z.object({
    directory: z.string().describe('Absolute path to the directory to lint')
  }),
  outputSchema: z.object({
    errors: z.array(
      z.object({
        file: z.string(),
        line: z.number(),
        column: z.number(),
        ruleId: z.string(),
        severity: z.enum(['error', 'warning']),
        message: z.string()
      })
    )
  }),
  execute: async ({ context }) => {
    // Placeholder: will integrate ESLint programmatic API in a future phase
    console.log(`[eslint-tool] Would lint: ${context.directory}`)
    return { errors: [] }
  }
})
