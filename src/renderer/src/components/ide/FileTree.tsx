import { useState } from 'react'
import { TreeView, type TreeViewDataItem } from '@patternfly/react-core'
import FolderIcon from '@patternfly/react-icons/dist/esm/icons/folder-icon'
import FolderOpenIcon from '@patternfly/react-icons/dist/esm/icons/folder-open-icon'

interface TreeNode {
  name: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

const mockTree: TreeNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      {
        name: 'components',
        type: 'directory',
        children: [
          { name: 'LoginForm.tsx', type: 'file' },
          { name: 'NavBar.tsx', type: 'file' },
          { name: 'ImageCard.tsx', type: 'file' },
          { name: 'Modal.tsx', type: 'file' }
        ]
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'index.tsx', type: 'file' }
    ]
  },
  { name: 'package.json', type: 'file' }
]

function toTreeViewData(nodes: TreeNode[], parentKey = ''): TreeViewDataItem[] {
  return nodes.map((node) => {
    const key = `${parentKey}/${node.name}`
    const item: TreeViewDataItem = {
      name: node.name,
      id: key
    }
    if (node.type === 'directory') {
      item.icon = <FolderIcon />
      item.expandedIcon = <FolderOpenIcon />
      if (node.children) {
        item.children = toTreeViewData(node.children, key)
      }
      item.defaultExpanded = true
    }
    return item
  })
}

const treeData = toTreeViewData(mockTree)

function findItemPath(items: TreeViewDataItem[], targetId: string): TreeViewDataItem[] {
  for (const item of items) {
    if (item.id === targetId) return [item]
    if (item.children) {
      const childPath = findItemPath(item.children, targetId)
      if (childPath.length) return [item, ...childPath]
    }
  }
  return []
}

export function FileTree() {
  const [activeItems, setActiveItems] = useState<TreeViewDataItem[]>([])

  const handleSelect = (_event: React.MouseEvent, item: TreeViewDataItem) => {
    setActiveItems(findItemPath(treeData, item.id!))
  }

  return (
    <TreeView
      data={treeData}
      activeItems={activeItems}
      onSelect={handleSelect}
      aria-label="Project files"
    />
  )
}
