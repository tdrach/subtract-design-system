import {
  Board,
  BoardColumn,
  BoardColumnHeader,
  BoardColumnBody,
  BoardCard,
  BoardCardTitle,
  BoardCardMeta,
  BoardCardAdd,
} from '@subtract/ds'
import { Plus } from '@phosphor-icons/react'

// ─── Lane data ───────────────────────────────────────────────────────────────

type Job = { id: string; title: string; meta: string }

const PRINTING: Job[] = [
  { id: 'j-1045', title: 'Baseplate 6×4 — Prusa MK4', meta: '3h 40m left' },
  { id: 'j-1044', title: 'Nozzle wrench — Bambu P1S', meta: '18m left' },
  { id: 'j-1051', title: 'Gridfinity 2×2 bin ×12', meta: '52m left' },
]

const QUEUED: Job[] = [
  { id: 'j-1042', title: 'Hinge bracket v4', meta: 'Due Aug 6' },
  { id: 'j-1046', title: 'Cable clip ×40 — PETG', meta: 'Due Aug 7' },
]

const REVIEW: Job[] = [
  { id: 'j-1039', title: 'Enclosure lid, draft pass', meta: 'Waiting on Mira' },
]

// ─── Layout glue ─────────────────────────────────────────────────────────────

const SURFACE: React.CSSProperties = {
  background: 'var(--light)',
  border: '1px solid var(--demure)',
  borderRadius: 12,
  padding: 16,
}

// Shrink-wraps a single-lane board so it doesn't sit in a wide empty field.
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

function Jobs({ jobs }: { jobs: Job[] }) {
  return (
    <>
      {jobs.map((job) => (
        <BoardCard key={job.id}>
          <BoardCardTitle>{job.title}</BoardCardTitle>
          <BoardCardMeta>
            <span>{job.meta}</span>
          </BoardCardMeta>
        </BoardCard>
      ))}
    </>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function Lane() {
  return (
    <div style={SURFACE_HUG}>
      <Board>
        <BoardColumn>
          <BoardColumnHeader
            label="Printing"
            color="#11A0FF"
            count={PRINTING.length}
            action={<AddAction lane="Printing" />}
          />
          <BoardColumnBody>
            <Jobs jobs={PRINTING} />
            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}

export function HeaderTreatments() {
  return (
    <div style={SURFACE}>
      <Board>
        <BoardColumn width={252}>
          <BoardColumnHeader
            label="Printing"
            color="#11A0FF"
            count={2}
            action={<AddAction lane="Printing" />}
          />
          <BoardColumnBody>
            <Jobs jobs={PRINTING.slice(0, 2)} />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn width={252}>
          <BoardColumnHeader label="Needs review" count={REVIEW.length} />
          <BoardColumnBody>
            <Jobs jobs={REVIEW} />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn width={252}>
          <BoardColumnHeader label="Part library" />
          <BoardColumnBody>
            <Jobs jobs={QUEUED} />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}

export function EmptyLane() {
  return (
    <div style={SURFACE}>
      <Board>
        <BoardColumn width={252}>
          <BoardColumnHeader
            label="Blocked"
            color="#FF2111"
            count={0}
            action={<AddAction lane="Blocked" />}
          />
          <BoardColumnBody>
            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn width={252}>
          <BoardColumnHeader
            label="Queued"
            color="#FFA811"
            count={QUEUED.length}
            action={<AddAction lane="Queued" />}
          />
          <BoardColumnBody>
            <Jobs jobs={QUEUED} />
            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}

export function Widths() {
  return (
    <div style={SURFACE}>
      <Board>
        <BoardColumn width={160}>
          <span style={CAPTION}>width 160</span>
          <BoardColumnHeader label="Queued" color="#FFA811" count={1} />
          <BoardColumnBody>
            <Jobs jobs={QUEUED.slice(0, 1)} />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn width={224}>
          <span style={CAPTION}>width 224</span>
          <BoardColumnHeader label="Printing" color="#11A0FF" count={1} />
          <BoardColumnBody>
            <Jobs jobs={PRINTING.slice(0, 1)} />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn>
          <span style={CAPTION}>default 288</span>
          <BoardColumnHeader label="Needs review" color="#06D021" count={1} />
          <BoardColumnBody>
            <Jobs jobs={REVIEW} />
          </BoardColumnBody>
        </BoardColumn>
      </Board>
    </div>
  )
}
