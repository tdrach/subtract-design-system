import { IconButton, NumberInput, Select } from '@subtract/ds'
import {
  Cursor,
  ArrowsOutCardinal,
  ArrowsClockwise,
  Ruler,
  Magnet,
  GridFour,
  LinkSimple,
  Eye,
  Lock,
  DotsThree,
} from '@phosphor-icons/react'

export function Toolbar() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
      <IconButton active aria-label="Select">
        <Cursor size={14} weight="bold" />
      </IconButton>
      <IconButton aria-label="Move">
        <ArrowsOutCardinal size={14} weight="bold" />
      </IconButton>
      <IconButton aria-label="Rotate">
        <ArrowsClockwise size={14} weight="bold" />
      </IconButton>
      <IconButton aria-label="Measure">
        <Ruler size={14} weight="bold" />
      </IconButton>
      <IconButton active aria-label="Snap to grid">
        <Magnet size={14} weight="bold" />
      </IconButton>
      <IconButton aria-label="Show build plate">
        <GridFour size={14} weight="bold" />
      </IconButton>
    </div>
  )
}

export function States() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <IconButton aria-label="Hide layer">
        <Eye size={14} weight="bold" />
      </IconButton>
      <IconButton active aria-label="Lock layer">
        <Lock size={14} weight="bold" />
      </IconButton>
      <IconButton disabled aria-label="Layer options">
        <DotsThree size={14} weight="bold" />
      </IconButton>
    </div>
  )
}

export function FieldAdjacent() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: 92 }}>
        <NumberInput size="sm" label="W" suffix="mm" value={42} step={1} onChange={() => {}} aria-label="Width" />
      </div>
      <IconButton active aria-label="Lock aspect ratio">
        <LinkSimple size={14} weight="bold" />
      </IconButton>
      <div style={{ width: 92 }}>
        <NumberInput size="sm" label="H" suffix="mm" value={21} step={1} onChange={() => {}} aria-label="Height" />
      </div>
    </div>
  )
}

export function InspectorRow() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: 132 }}>
        <Select size="sm" defaultValue="subtract" aria-label="Boolean operation">
          <option value="union">Union</option>
          <option value="subtract">Subtract</option>
          <option value="intersect">Intersect</option>
        </Select>
      </div>
      <IconButton aria-label="Recompute">
        <ArrowsClockwise size={14} weight="bold" />
      </IconButton>
      <IconButton active aria-label="More options">
        <DotsThree size={14} weight="bold" />
      </IconButton>
    </div>
  )
}
