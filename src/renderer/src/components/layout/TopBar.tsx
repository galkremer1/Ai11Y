import { Title } from '@patternfly/react-core'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <div className="ai11y-topbar">
      <Title headingLevel="h1" size="md">
        {title}
      </Title>
    </div>
  )
}
