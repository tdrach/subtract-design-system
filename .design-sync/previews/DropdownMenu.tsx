import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from '@subtract/ds'
import { CaretDown, DotsThree } from '@phosphor-icons/react'

export function PartActions() {
  return (
    <div style={{ padding: 16 }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="gray" size="sm" iconOnly aria-label="Part actions">
            <DotsThree size={16} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Rename part</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Export STL</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>Delete part</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ExportFormats() {
  return (
    <div style={{ padding: 16 }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="gray" size="sm" iconAfter={<CaretDown size={12} weight="bold" />}>
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>STL — mesh</DropdownMenuItem>
          <DropdownMenuItem>3MF — mesh + colours</DropdownMenuItem>
          <DropdownMenuItem>STEP — solid</DropdownMenuItem>
          <DropdownMenuItem>SVG — flat pattern</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Copy share link</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function WorkspaceSwitcher() {
  return (
    <div style={{ padding: 16 }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" iconAfter={<CaretDown size={12} weight="bold" />}>
            Subtract Studio
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Subtract Studio</DropdownMenuItem>
          <DropdownMenuItem>Gridfinity Lab</DropdownMenuItem>
          <DropdownMenuItem>Shop floor — Bay 2</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>New workspace…</DropdownMenuItem>
          <DropdownMenuItem>Workspace settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
