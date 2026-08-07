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

// ─── Print-farm board data ───────────────────────────────────────────────────

type Job = { id: string; title: string; who: string; meta: string }

const QUEUED: Job[] = [
  { id: 'j-1042', title: 'Hinge bracket v4 — reprint at 0.16 mm', who: 'TD', meta: 'Due Aug 6' },
  { id: 'j-1046', title: 'Cable clip ×40 — PETG', who: 'MR', meta: 'Due Aug 7' },
  { id: 'j-1047', title: 'Spool holder arm, left', who: 'TD', meta: 'Due Aug 8' },
]

const PRINTING: Job[] = [
  { id: 'j-1045', title: 'Baseplate 6×4 — Prusa MK4', who: 'MR', meta: '3h 40m left' },
  { id: 'j-1044', title: 'Nozzle wrench — Bambu P1S', who: 'CB', meta: '18m left' },
]

const SHIPPED: Job[] = [
  { id: 'j-1038', title: 'Enclosure lid, draft pass', who: 'CB', meta: 'Aug 2' },
  { id: 'j-1033', title: 'Lens cap prototype — resin', who: 'TD', meta: 'Aug 1' },
]

const LANE_WIDTH = 252

// ─── Layout glue ─────────────────────────────────────────────────────────────

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--light)', border: '1px solid var(--demure)', borderRadius: 12, padding: 16 }}>
      {children}
    </div>
  )
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

function JobBody({ job, avatar }: { job: Job; avatar?: boolean }) {
  return (
    <>
      <BoardCardTitle>{job.title}</BoardCardTitle>
      <BoardCardMeta>
        {avatar ? <PersonaAvatar orb={false} initial={job.who} size="sm" /> : null}
        <span>{job.meta}</span>
      </BoardCardMeta>
    </>
  )
}

function Lane({
  label,
  color,
  jobs,
  avatars,
  addLabel = 'New job',
}: {
  label: string
  color: string
  jobs: Job[]
  avatars?: boolean
  addLabel?: string
}) {
  return (
    <BoardColumn width={LANE_WIDTH}>
      <BoardColumnHeader label={label} color={color} count={jobs.length} action={<AddAction lane={label} />} />
      <BoardColumnBody>
        {jobs.map((job) => (
          <BoardCard key={job.id}>
            <JobBody job={job} avatar={avatars} />
          </BoardCard>
        ))}
        <BoardCardAdd label={addLabel} />
      </BoardColumnBody>
    </BoardColumn>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function PrintQueue() {
  return (
    <Surface>
      <Board>
        <Lane label="Queued" color="#FFA811" jobs={QUEUED} />
        <Lane label="Printing" color="#11A0FF" jobs={PRINTING} />
        <Lane label="Shipped" color="#06D021" jobs={SHIPPED} />
      </Board>
    </Surface>
  )
}

export function WithAssignees() {
  return (
    <Surface>
      <Board>
        <Lane label="Queued" color="#FFA811" jobs={QUEUED} avatars />
        <Lane label="Printing" color="#11A0FF" jobs={PRINTING} avatars />
        <Lane label="Shipped" color="#06D021" jobs={SHIPPED} avatars />
      </Board>
    </Surface>
  )
}

export function DragInFlight() {
  return (
    <Surface>
      <Board>
        <BoardColumn width={LANE_WIDTH}>
          <BoardColumnHeader
            label="Queued"
            color="#FFA811"
            count={QUEUED.length}
            action={<AddAction lane="Queued" />}
          />
          <BoardColumnBody>
            <BoardCard isDragging>
              <JobBody job={QUEUED[0]} />
            </BoardCard>
            {QUEUED.slice(1).map((job) => (
              <BoardCard key={job.id}>
                <JobBody job={job} />
              </BoardCard>
            ))}
            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>

        <BoardColumn width={LANE_WIDTH}>
          <BoardColumnHeader
            label="Printing"
            color="#11A0FF"
            count={PRINTING.length}
            action={<AddAction lane="Printing" />}
          />
          <BoardColumnBody>
            <BoardDropIndicator />
            {PRINTING.map((job) => (
              <BoardCard key={job.id}>
                <JobBody job={job} />
              </BoardCard>
            ))}
            <BoardCardAdd label="New job" />
          </BoardColumnBody>
        </BoardColumn>

        <Lane label="Shipped" color="#06D021" jobs={SHIPPED} />
      </Board>
    </Surface>
  )
}
