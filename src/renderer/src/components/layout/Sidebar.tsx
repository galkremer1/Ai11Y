import { Nav, NavList, NavItem } from '@patternfly/react-core'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import GlobeIcon from '@patternfly/react-icons/dist/esm/icons/globe-icon'
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon'

export type Page = 'ide' | 'browser' | 'setup'

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'ide', label: 'IDE Auditor', icon: <CodeIcon /> },
  { id: 'browser', label: 'Browser Auditor', icon: <GlobeIcon /> },
  { id: 'setup', label: 'Setup', icon: <CogIcon /> }
]

interface SidebarProps {
  current: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <Nav
      aria-label="Main navigation"
      onSelect={(_e, result) => onNavigate(result.itemId as Page)}
    >
      <NavList>
        {navItems.map(({ id, label, icon }) => (
          <NavItem
            key={id}
            itemId={id}
            isActive={current === id}
            icon={icon}
            component="button"
          >
            {label}
          </NavItem>
        ))}
      </NavList>
    </Nav>
  )
}
