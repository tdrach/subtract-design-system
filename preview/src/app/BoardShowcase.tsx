'use client'

import { useEffect, useState } from 'react'
import {
  Board, BoardColumn, BoardColumnHeader, BoardColumnBody,
  BoardCard, BoardCardTitle, BoardCardMeta, BoardCardAdd,
  PersonaAvatar,
  ButtonGroup, ButtonGroupItem,
} from '@subtract/ds'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, useDroppable,
  type DragStartEvent, type DragOverEvent, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from '@phosphor-icons/react'
import styles from './page.module.scss'

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Card {
  id: string
  title: string
  who?: string
  date?: string
}

interface Column {
  id: string
  label: string
  color?: string
  cardIds: string[]
}

const CARDS: Record<string, Card> = {
  c1: { id: 'c1', title: 'Update "Design" section of intl funding with the latest mocks', who: 'CB', date: 'Jul 12, 2023' },
  c2: { id: 'c2', title: 'Show final intl funding designs w Mansi and send to WW.', who: 'CB', date: 'Jul 10, 2023' },
  c3: { id: 'c3', title: 'One iteration of Builder App designs', who: 'CB', date: 'May 30, 2025' },
  c4: { id: 'c4', title: 'Solidify designs for status + analytics on Appchains', who: 'CB', date: 'May 28, 2025' },
  c5: { id: 'c5', title: 'Draft Q3 review doc', who: 'TD', date: 'Aug 1, 2025' },
  c6: { id: 'c6', title: 'Sketch onboarding empty states', who: 'TD', date: 'Aug 2, 2025' },
  c7: { id: 'c7', title: 'Reply to design review thread', who: 'CB', date: 'Aug 3, 2025' },
}

const INITIAL_COLUMNS: Column[] = [
  { id: 'bonus', label: 'BONUS / Next Up', color: '#d6589a', cardIds: ['c5'] },
  { id: 'today', label: 'Today would be really g…', color: '#d9a441', cardIds: ['c6', 'c7'] },
  { id: 'p1', label: '#1 Priority', color: '#d97706', cardIds: [] },
  { id: 'done', label: 'Completed', color: '#06D021', cardIds: ['c1', 'c2'] },
  { id: 'icebox', label: 'Icebox', color: '#11A0FF', cardIds: ['c3', 'c4'] },
]

// ─── Sortable card ──────────────────────────────────────────────────────────────

function SortableCard({ card, showAvatar }: { card: Card; showAvatar?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  return (
    <BoardCard
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
    >
      <CardBody card={card} showAvatar={showAvatar} />
    </BoardCard>
  )
}

function CardBody({ card, showAvatar = false }: { card: Card; showAvatar?: boolean }) {
  const showMeta = (showAvatar && card.who) || card.date
  return (
    <>
      <BoardCardTitle>{card.title}</BoardCardTitle>
      {showMeta && (
        <BoardCardMeta>
          {showAvatar && card.who && <PersonaAvatar orb={false} initial={card.who} size="sm" />}
          {card.date && <span>{card.date}</span>}
        </BoardCardMeta>
      )}
    </>
  )
}

// ─── Column header (shared by static + sortable columns) ─────────────────────────

function ColumnHeader({ column }: { column: Column }) {
  return (
    <BoardColumnHeader
      label={column.label}
      color={column.color}
      count={column.cardIds.length}
      action={
        <button className={styles.boardHeaderBtn} aria-label={`Add to ${column.label}`}>
          <Plus size={14} weight="bold" />
        </button>
      }
    />
  )
}

// ─── Droppable column (interactive, post-hydration) ──────────────────────────────

function Column({ column, showAvatars }: { column: Column; showAvatars?: boolean }) {
  // Lets empty columns still accept a drop.
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <BoardColumn>
      <ColumnHeader column={column} />
      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <BoardColumnBody ref={setNodeRef}>
          {column.cardIds.map((id) => (
            <SortableCard key={id} card={CARDS[id]} showAvatar={showAvatars} />
          ))}
          <BoardCardAdd />
        </BoardColumnBody>
      </SortableContext>
    </BoardColumn>
  )
}

// ─── Static column (server + first paint; no dnd-kit, so no aria-id mismatch) ─────

function StaticColumn({ column, showAvatars }: { column: Column; showAvatars?: boolean }) {
  return (
    <BoardColumn>
      <ColumnHeader column={column} />
      <BoardColumnBody>
        {column.cardIds.map((id) => (
          <BoardCard key={id}>
            <CardBody card={CARDS[id]} showAvatar={showAvatars} />
          </BoardCard>
        ))}
        <BoardCardAdd />
      </BoardColumnBody>
    </BoardColumn>
  )
}

// ─── Board showcase ──────────────────────────────────────────────────────────────

export function BoardShowcase() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAvatars, setShowAvatars] = useState(false) // off by default
  // dnd-kit generates aria ids from a global counter that differs between the
  // server and client render — gate the interactive board behind mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  // Which column holds a given id (card id → its column; column id → itself).
  function columnOf(id: string): Column | undefined {
    return (
      columns.find((c) => c.id === id) ??
      columns.find((c) => c.cardIds.includes(id))
    )
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  // Live cross-column move while hovering.
  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    const from = columnOf(activeId)
    const to = columnOf(overId)
    if (!from || !to || from.id === to.id) return

    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, cardIds: [...c.cardIds] }))
      const fromCol = next.find((c) => c.id === from.id)!
      const toCol = next.find((c) => c.id === to.id)!
      fromCol.cardIds = fromCol.cardIds.filter((id) => id !== activeId)
      // Insert at the hovered card's position, or append when over the column itself.
      const overIndex = toCol.cardIds.indexOf(overId)
      const insertAt = overIndex >= 0 ? overIndex : toCol.cardIds.length
      toCol.cardIds.splice(insertAt, 0, activeId)
      return next
    })
  }

  // Reorder within the final column.
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setActiveId(null)
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    const col = columnOf(activeId)
    if (!col) return
    const oldIndex = col.cardIds.indexOf(activeId)
    const newIndex = col.cardIds.indexOf(overId)
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    setColumns((prev) =>
      prev.map((c) =>
        c.id === col.id ? { ...c, cardIds: arrayMove(c.cardIds, oldIndex, newIndex) } : c,
      ),
    )
  }

  const activeCard = activeId ? CARDS[activeId] : null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Board</h2>
      <p className={styles.chartIntro}>
        A Notion-style kanban: <code>Board</code> / <code>BoardColumn</code> /{' '}
        <code>BoardColumnHeader</code> (tinted label + count + action) /{' '}
        <code>BoardCard</code> (title, meta, drag states). The DS pieces are
        purely presentational — this demo drives them with <code>@dnd-kit</code>{' '}
        (a preview-only dependency). Drag cards within a column to reorder, or
        across columns to recategorize.
      </p>

      <div className={styles.boardToolbar}>
        <span className={styles.boardToolbarLabel}>Avatars</span>
        <ButtonGroup aria-label="Toggle card avatars">
          <ButtonGroupItem size="sm" selected={!showAvatars} onClick={() => setShowAvatars(false)}>Off</ButtonGroupItem>
          <ButtonGroupItem size="sm" selected={showAvatars} onClick={() => setShowAvatars(true)}>On</ButtonGroupItem>
        </ButtonGroup>
      </div>

      {!mounted ? (
        <Board>
          {columns.map((column) => (
            <StaticColumn key={column.id} column={column} showAvatars={showAvatars} />
          ))}
        </Board>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Board>
            {columns.map((column) => (
              <Column key={column.id} column={column} showAvatars={showAvatars} />
            ))}
          </Board>

          <DragOverlay>
            {activeCard ? (
              <BoardCard isOverlay>
                <CardBody card={activeCard} showAvatar={showAvatars} />
              </BoardCard>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </section>
  )
}
