import {
  Board,
  BoardColumn,
  BoardColumnHeader,
  BoardColumnBody,
  BoardCard,
  BoardCardTitle,
  BoardCardMeta,
  BoardCardAdd,
  BoardDropIndicator,
  PersonaAvatar,
} from '@subtract/ds'
import { Plus } from '@phosphor-icons/react'

// ─── Layout glue ─────────────────────────────────────────────────────────────

const SURFACE: React.CSSProperties = {
  background: 'var(--light)',
  border: '1px solid var(--demure)',
  borderRadius: 12,
  padding: 16,
}

const SURFACE_HUG: React.CSSProperties = { ...SURFACE, display: 'inline-block' }

const CAPTION: React.CSSProperties = {
  display: 'block',
  marginBottom: 10,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--ink-light)',
}

const STATE_ROW: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  alignItems: 'flex-start',
}

function AddAction({ lane }: { lane: string }) {
  return (
    <button
      type="button"
      aria-label={`Add a job to ${lane}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        border: 0,
        borderRadius: 5,
        background: 'transparent',
        color: 'var(--ink-light)',
        cursor: 'pointer',
      }}
    >
      <Plus size={14} weight="bold" />
    </button>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function JobCard() {
  return (
    <div style={SURFACE_HUG}>
      <Board>
        <BoardColumn>
          <BoardColumnHeader
            label="Printing"
            color="#11A0FF"
            count={3}
            action={<AddAction lane="Printing" />}
          />
          <BoardColumnBody>
            <BoardCard>
              <BoardCardTitle>Nozzle wrench — Bambu P1S</BoardCardTitle>
            </BoardCard>

            <BoardCard>
              <BoardCardTitle>Baseplate 6×4 — Prusa MK4, 0.2 mm draft</BoardCardTitle>
              <BoardCardMeta>
                <span>3h 40m left</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardCard>
              <BoardCardTitle>Gridfinity 2×2 bin ×12 — PETG</BoardCardTitle>
              <BoardCardMeta>
                <PersonaAvatar orb={false} initial="MR" size="sm" />
                <span>Mira R.</span>
                <span aria-hidden="true">·</span>
                <span>52m left</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}

export function DragStates() {
  return (
    <div style={SURFACE}>
      <div style={STATE_ROW}>
        <div style={{ width: 252 }}>
          <span style={CAPTION}>Resting</span>
          <BoardCard>
            <BoardCardTitle>Hinge bracket v4 — reprint at 0.16 mm</BoardCardTitle>
            <BoardCardMeta>
              <span>Due Aug 6</span>
            </BoardCardMeta>
          </BoardCard>
        </div>

        <div style={{ width: 252 }}>
          <span style={CAPTION}>Origin, in flight</span>
          <BoardCard isDragging>
            <BoardCardTitle>Hinge bracket v4 — reprint at 0.16 mm</BoardCardTitle>
            <BoardCardMeta>
              <span>Due Aug 6</span>
            </BoardCardMeta>
          </BoardCard>
        </div>

        <div style={{ width: 252 }}>
          <span style={CAPTION}>Drag overlay</span>
          <BoardCard isOverlay>
            <BoardCardTitle>Hinge bracket v4 — reprint at 0.16 mm</BoardCardTitle>
            <BoardCardMeta>
              <span>Due Aug 6</span>
            </BoardCardMeta>
          </BoardCard>
        </div>
      </div>
    </div>
  )
}

export function DropTarget() {
  return (
    <div style={SURFACE_HUG}>
      <Board>
        <BoardColumn>
          <BoardColumnHeader
            label="Queued"
            color="#FFA811"
            count={4}
            action={<AddAction lane="Queued" />}
          />
          <BoardColumnBody>
            <BoardCard isDragging>
              <BoardCardTitle>Spool holder arm, left</BoardCardTitle>
              <BoardCardMeta>
                <span>Due Aug 8</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardCard>
              <BoardCardTitle>Cable clip ×40 — PETG</BoardCardTitle>
              <BoardCardMeta>
                <span>Due Aug 7</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardDropIndicator />

            <BoardCard>
              <BoardCardTitle>Hinge bracket v4 — reprint at 0.16 mm</BoardCardTitle>
              <BoardCardMeta>
                <span>Due Aug 6</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardCard>
              <BoardCardTitle>Lens cap prototype — resin</BoardCardTitle>
              <BoardCardMeta>
                <span>Due Aug 9</span>
              </BoardCardMeta>
            </BoardCard>

            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}
