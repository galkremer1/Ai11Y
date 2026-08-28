import { useState } from 'react'
import { Sidebar, type Page } from './components/layout/Sidebar'
import { IDEAuditor } from './pages/IDEAuditor'
import { BrowserAuditor } from './pages/BrowserAuditor'
import { Setup } from './pages/Setup'

const pageTitles: Record<Page, string> = {
  ide: 'IDE Auditor',
  browser: 'Browser Auditor',
  setup: 'Setup'
}

export default function App() {
  const [page, setPage] = useState<Page>('ide')

  return (
    <div className="ai11y-shell">
      <nav className="ai11y-sidebar">
        <div className="ai11y-titlebar-drag" />
        <Sidebar current={page} onNavigate={setPage} />
      </nav>
      <main className="ai11y-page-content">
        {page === 'ide' && <IDEAuditor title={pageTitles.ide} />}
        {page === 'browser' && <BrowserAuditor title={pageTitles.browser} />}
        {page === 'setup' && <Setup title={pageTitles.setup} />}
      </main>
    </div>
  )
}
