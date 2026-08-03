import { Button } from '@subtract/ds'
import { Plus, ArrowRight, Trash } from '@phosphor-icons/react'

export function Variants() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="gray">Dismiss</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
      <Button size="dense">Dense</Button>
    </div>
  )
}

export function WithIcons() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button iconBefore={<Plus size={16} weight="bold" />}>New project</Button>
      <Button variant="secondary" iconAfter={<ArrowRight size={16} weight="bold" />}>
        Continue
      </Button>
      <Button variant="gray" iconOnly aria-label="Delete">
        <Trash size={16} weight="bold" />
      </Button>
    </div>
  )
}

export function States() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Enabled</Button>
      <Button disabled>Disabled</Button>
      <Button split>Publish</Button>
    </div>
  )
}
