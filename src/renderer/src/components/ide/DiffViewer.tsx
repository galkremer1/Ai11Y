import { DiffEditor } from '@monaco-editor/react'

interface DiffViewerProps {
  original: string
  modified: string
  language?: string
}

export function DiffViewer({
  original,
  modified,
  language = 'typescript'
}: DiffViewerProps) {
  return (
    <DiffEditor
      height="100%"
      language={language}
      original={original}
      modified={modified}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false,
        renderSideBySide: true,
        automaticLayout: true
      }}
    />
  )
}
