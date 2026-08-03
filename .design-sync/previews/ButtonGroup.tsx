import { ButtonGroup, ButtonGroupItem, ButtonGroupText } from '@subtract/ds'
import {
  ListBullets,
  SquaresFour,
  Rows,
  Copy,
  Plus,
  Minus,
  Crosshair,
} from '@phosphor-icons/react'

export function SingleSelect() {
  return (
    <ButtonGroup aria-label="Print quality">
      <ButtonGroupItem size="sm">Draft</ButtonGroupItem>
      <ButtonGroupItem size="sm" selected>
        Standard
      </ButtonGroupItem>
      <ButtonGroupItem size="sm">Fine</ButtonGroupItem>
    </ButtonGroup>
  )
}

export function ViewToggle() {
  return (
    <ButtonGroup aria-label="View">
      <ButtonGroupItem iconBefore={<ListBullets size={15} weight="bold" />}>List</ButtonGroupItem>
      <ButtonGroupItem selected iconBefore={<SquaresFour size={15} weight="bold" />}>
        Board
      </ButtonGroupItem>
      <ButtonGroupItem iconBefore={<Rows size={15} weight="bold" />}>Table</ButtonGroupItem>
    </ButtonGroup>
  )
}

export function ActionCluster() {
  return (
    <ButtonGroup aria-label="Text format">
      <ButtonGroupItem iconOnly size="sm" aria-label="Bold">
        <strong>B</strong>
      </ButtonGroupItem>
      <ButtonGroupItem iconOnly size="sm" selected aria-label="Italic">
        <em>I</em>
      </ButtonGroupItem>
      <ButtonGroupItem iconOnly size="sm" aria-label="Duplicate">
        <Copy size={14} weight="bold" />
      </ButtonGroupItem>
      <ButtonGroupItem iconOnly size="sm" aria-label="Center on origin">
        <Crosshair size={14} weight="bold" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}

export function WithTextAddon() {
  return (
    <ButtonGroup aria-label="Export format">
      <ButtonGroupText>Export</ButtonGroupText>
      <ButtonGroupItem size="sm" selected>
        STL
      </ButtonGroupItem>
      <ButtonGroupItem size="sm">3MF</ButtonGroupItem>
      <ButtonGroupItem size="sm">STEP</ButtonGroupItem>
    </ButtonGroup>
  )
}

export function Vertical() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Zoom">
      <ButtonGroupItem iconOnly size="sm" aria-label="Zoom in">
        <Plus size={14} weight="bold" />
      </ButtonGroupItem>
      <ButtonGroupItem iconOnly size="sm" aria-label="Zoom out">
        <Minus size={14} weight="bold" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
