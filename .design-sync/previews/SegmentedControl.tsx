import { SegmentedControl, IconButton, Button } from '@subtract/ds'
import { SquaresFour, ListBullets, Rows, ArrowsClockwise, Export } from '@phosphor-icons/react'

export function ViewMode() {
  return (
    <SegmentedControl
      value="slice"
      onChange={() => {}}
      options={[
        { label: 'Model', value: 'model' },
        { label: 'Slice', value: 'slice' },
        { label: 'Preview', value: 'preview' },
      ]}
    />
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <SegmentedControl
        size="sm"
        value="mm"
        onChange={() => {}}
        options={[
          { label: 'mm', value: 'mm' },
          { label: 'in', value: 'in' },
        ]}
      />
      <SegmentedControl
        size="md"
        value="fabricate"
        onChange={() => {}}
        options={[
          { label: 'Design', value: 'design' },
          { label: 'Fabricate', value: 'fabricate' },
          { label: 'Ship', value: 'ship' },
        ]}
      />
    </div>
  )
}

export function IconOptions() {
  return (
    <SegmentedControl
      value="board"
      onChange={() => {}}
      options={[
        { label: <ListBullets size={14} weight="bold" />, value: 'list', title: 'List' },
        { label: <SquaresFour size={14} weight="bold" />, value: 'board', title: 'Board' },
        { label: <Rows size={14} weight="bold" />, value: 'table', title: 'Table' },
      ]}
    />
  )
}

export function ToolbarRow() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <SegmentedControl
        value="plate"
        onChange={() => {}}
        options={[
          { label: 'Bin', value: 'bin' },
          { label: 'Plate', value: 'plate' },
        ]}
      />
      <IconButton aria-label="Re-slice">
        <ArrowsClockwise size={14} weight="bold" />
      </IconButton>
      <Button size="dense" variant="secondary" iconBefore={<Export size={13} weight="bold" />}>
        Export STL
      </Button>
    </div>
  )
}
