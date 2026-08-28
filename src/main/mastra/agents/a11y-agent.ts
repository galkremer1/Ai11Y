import { Agent } from '@mastra/core/agent'
import { createOpenAI } from '@ai-sdk/openai'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getA11yAgent(config: {
  mode: 'cloud' | 'local'
  apiKey?: string
  baseURL?: string
  modelName: string
}): Agent {
  const ollamaBaseURL = 'http://localhost:11434/v1'

  const provider = createOpenAI({
    baseURL: config.mode === 'local' ? config.baseURL || ollamaBaseURL : config.baseURL,
    apiKey: config.mode === 'cloud' ? config.apiKey : 'ollama'
  })

  const model = provider(config.modelName)

  return new Agent({
    name: 'Accessibility Auditor',
    instructions: `
      You are an expert web accessibility engineer.
      Analyze the provided Axe-core JSON violations and broken source code.
      Write corrected framework code (.jsx, .vue, .html).
      Use reasoning (<think> tags if supported) to explain screen-reader impacts.
    `,
    model
  })
}
