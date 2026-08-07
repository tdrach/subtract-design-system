import { DataTable, TagPill } from '@subtract/ds'
import type { ColumnDef, RowAction, Tag } from '@subtract/ds'

// ─── Print-queue demo data ───────────────────────────────────────────────────

const PROCESS_TAGS: Record<string, Tag> = {
  fdm:   { id: 'fdm',   name: 'FDM',   color: '#2563eb' },
  resin: { id: 'resin', name: 'Resin', color: '#7c3aed' },
  cnc:   { id: 'cnc',   name: 'CNC',   color: '#0f766e' },
}

type JobRow = {
  id: string
  part: string
  status: 'Queued' | 'Printing' | 'Complete' | 'Failed'
  priority: 'High' | 'Medium' | 'Low'
  process: Tag[]
  est: string
}

const JOB_ROWS: JobRow[] = [
  { id: 'j-1041', part: 'Gridfinity 2×2 bin ×12',   status: 'Printing', priority: 'High',   process: [PROCESS_TAGS.fdm],                     est: '1h 12m' },
  { id: 'j-1042', part: 'Hinge bracket v4',         status: 'Queued',   priority: 'Medium', process: [PROCESS_TAGS.fdm],                     est: '44m'    },
  { id: 'j-1038', part: 'Enclosure lid — draft',    status: 'Complete', priority: 'Low',    process: [PROCESS_TAGS.fdm, PROCESS_TAGS.cnc],   est: '2h 05m' },
  { id: 'j-1044', part: 'Nozzle wrench',            status: 'Failed',   priority: 'High',   process: [PROCESS_TAGS.fdm],                     est: '18m'    },
  { id: 'j-1045', part: 'Baseplate 6×4',            status: 'Printing', priority: 'Medium', process: [PROCESS_TAGS.fdm],                     est: '3h 40m' },
  { id: 'j-1046', part: 'Cable clip ×40',           status: 'Queued',   priority: 'Low',    process: [],                                     est: '52m'    },
  { id: 'j-1033', part: 'Lens cap prototype',       status: 'Complete', priority: 'Low',    process: [PROCESS_TAGS.resin],                   est: '41m'    },
  { id: 'j-1047', part: 'Spool holder arm',         status: 'Queued',   priority: 'High',   process: [PROCESS_TAGS.fdm, PROCESS_TAGS.resin], est: '1h 05m' },
]

const STATUS_COLORS: Record<string, string> = {
  'Queued':   'rgba(12,12,12,0.32)',
  'Printing': '#11A0FF',
  'Complete': '#06D021',
  'Failed':   '#FF2111',
}

const PRIORITY_COLORS: Record<string, string> = {
  'High':   '#FF2111',
  'Medium': '#FFA811',
  'Low':    'rgba(12,12,12,0.32)',
}

function renderStatus(value: unknown) {
  const s = String(value)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[s] ?? 'rgba(12,12,12,0.32)', flexShrink: 0 }} />
      {s}
    </span>
  )
}

function renderPriority(value: unknown) {
  const p = String(value)
  return <span style={{ fontWeight: 500, color: PRIORITY_COLORS[p] ?? 'rgba(12,12,12,0.32)' }}>{p}</span>
}

function getJobColumns(size: 'sm' | 'md' = 'sm'): ColumnDef<JobRow>[] {
  return [
    { id: 'part', header: 'Part', accessorKey: 'part' },
    { id: 'status', header: 'Status', accessorKey: 'status', width: 150, cell: (v) => renderStatus(v) },
    { id: 'priority', header: 'Priority', accessorKey: 'priority', width: 110, cell: (v) => renderPriority(v) },
    {
      id: 'process',
      header: 'Process',
      accessorKey: 'process',
      sortable: false,
      width: 170,
      cell: (v) => {
        const tags = (v as Tag[]) ?? []
        if (!tags.length) return null
        return (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tags.map((tag) => <TagPill key={tag.id} tag={tag} size={size} />)}
          </div>
        )
      },
    },
    { id: 'est', header: 'Est. time', accessorKey: 'est', width: 100, align: 'right' },
  ]
}

const JOB_COLUMNS = getJobColumns('sm')

const JOB_ACTIONS: RowAction<JobRow>[] = [
  { label: 'Open in slicer', onSelect: () => {} },
  { label: 'Duplicate job', onSelect: () => {} },
  { label: 'Move to top of queue', onSelect: () => {} },
  { separator: true },
  { label: 'Cancel job', destructive: true, onSelect: () => {} },
]

// ─── Stories ─────────────────────────────────────────────────────────────────

export function PrintQueue() {
  return (
    <DataTable
      columns={JOB_COLUMNS}
      data={JOB_ROWS}
      getRowId={(row) => row.id}
      rowActions={JOB_ACTIONS}
      selectable
      defaultSortId="part"
    />
  )
}

export function SizeMd() {
  return (
    <DataTable
      columns={getJobColumns('md')}
      data={JOB_ROWS.slice(0, 5)}
      getRowId={(row) => row.id}
      rowActions={JOB_ACTIONS}
      selectable
      size="md"
      defaultSortId="part"
    />
  )
}

export function ReadOnly() {
  return (
    <DataTable
      columns={JOB_COLUMNS.filter((c) => c.id !== 'process')}
      data={JOB_ROWS}
      getRowId={(row) => row.id}
      defaultSortId="priority"
      defaultSortDirection="desc"
    />
  )
}

// ─── Column help: headerTitle tooltip + onInfo header button ─────────────────

type SpecRow = {
  id: string
  part: string
  wall: string
  infill: string
  filament: string
  cost: string
}

const SPEC_ROWS: SpecRow[] = [
  { id: 's-1', part: 'Gridfinity 2×2 bin',  wall: '1.6 mm', infill: '15%', filament: '38 g',  cost: '$2.10' },
  { id: 's-2', part: 'Baseplate 6×4',       wall: '2.4 mm', infill: '20%', filament: '146 g', cost: '$7.85' },
  { id: 's-3', part: 'Hinge bracket v4',    wall: '2.0 mm', infill: '45%', filament: '61 g',  cost: '$3.40' },
  { id: 's-4', part: 'Spool holder arm',    wall: '3.2 mm', infill: '30%', filament: '92 g',  cost: '$4.95' },
  { id: 's-5', part: 'Enclosure lid',       wall: '1.2 mm', infill: '10%', filament: '54 g',  cost: '$2.88' },
]

const SPEC_COLUMNS: ColumnDef<SpecRow>[] = [
  { id: 'part', header: 'Part', accessorKey: 'part' },
  {
    id: 'wall',
    header: 'Wall',
    accessorKey: 'wall',
    width: 120,
    align: 'right',
    headerTitle: 'Shell thickness at the thinnest perimeter — must clear two nozzle widths.',
  },
  {
    id: 'infill',
    header: 'Infill',
    accessorKey: 'infill',
    width: 110,
    align: 'right',
    headerTitle: 'Gyroid infill density as a percentage of solid volume.',
  },
  {
    id: 'filament',
    header: 'Filament',
    accessorKey: 'filament',
    width: 120,
    align: 'right',
    headerTitle: 'Estimated mass including purge tower and supports.',
  },
  {
    id: 'cost',
    header: 'Cost',
    accessorKey: 'cost',
    width: 130,
    align: 'right',
    headerTitle: 'Material plus machine time at the shop rate.',
    onInfo: () => {},
  },
]

export function ColumnHelp() {
  return (
    <DataTable
      columns={SPEC_COLUMNS}
      data={SPEC_ROWS}
      getRowId={(row) => row.id}
      defaultSortId="part"
    />
  )
}

export function EmptyState() {
  return (
    <DataTable
      columns={JOB_COLUMNS}
      data={[]}
      emptyMessage="No print jobs in the queue. Slice a part to add one."
    />
  )
}
