'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Button, Footer, TextInput, ChecklistItem, Slider,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  TagSelector, TagPill,
  ExpandPanel, ExpandPanelTrigger, ExpandPanelContent, ExpandPanelBody,
  TabBar, Tab,
  LineChart,
  SegmentBar,
  GanttChart,
  FunnelChart,
  BubbleMatrix,
  DataTable,
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarSeparator, SidebarMenu, SidebarItem,
  ButtonGroup, ButtonGroupItem,
} from '@subtract/ds'
import type { Tag, CalendarDataPoint, LineSeriesData, GanttTask, FunnelStage, SegmentBarSegment, BubbleMatrixRow, BubbleMatrixCol, BubbleMatrixCell, ColumnDef, RowAction } from '@subtract/ds'
import { ChatShowcase } from './ChatShowcase'
import { BoardShowcase } from './BoardShowcase'
import { ChartTooltipPreview } from './ChartTooltipPreview'
import {
  Plus, Minus, Check, X, Trash, PencilSimple, Copy, DownloadSimple, UploadSimple,
  ShareFat, Link, ArrowCounterClockwise, Funnel,
  House, ArrowLeft, ArrowRight, MagnifyingGlass, CaretDown, CaretRight,
  DotsThree, DotsThreeVertical, ArrowUpRight,
  Bell, Gear, User, Users, Lock, LockOpen, Eye, EyeSlash, Star, BookmarkSimple,
  File, FilePlus, Folder, FolderOpen, Image, Tag as TagIcon, Database, ListBullets,
  ChatCircle, Envelope, At, Warning, Info, CheckCircle, XCircle,
  Smiley, Sparkle, Rocket, Lightning,
  ChartLine, Calendar, Tray, Wrench, Lifebuoy, Question,
  SignOut, CaretUpDown,
} from '@phosphor-icons/react'
import styles from './page.module.scss'

// ─── Data ─────────────────────────────────────────────────────────────────────

const colors = [
  { name: '$black',       value: '#0c0c0c',                  dark: true  },
  { name: '$light',       value: '#f3f3f3',                  dark: false },
  { name: '$white',       value: '#ffffff',                  dark: false },
  { name: '$demure',      value: '#dcddd7',                  dark: false },
  { name: '$blue',        value: '#11A0FF',                  dark: true  },
  { name: '$error',       value: '#FF2111',                  dark: true  },
  { name: '$green',       value: '#06D021',                  dark: true  },
  { name: '$warning',     value: '#FFA811',                  dark: false },
  { name: '$ink-dark',    value: '#0c0c0c',                  dark: true  },
  { name: '$ink-light',   value: '#ffffff',                  dark: false, outline: true },
  { name: '$muted',       value: '#0c0c0c7a',                  dark: true  },
  { name: '$muted-light', value: 'rgba(255, 255, 255, 0.7)', dark: false, outline: true },
]

const typeScale = [
  { name: '$text-3xl',  size: '9rem',      px: '144px',  label: 'Hero title',              letterSpacing: '-0.07em', lineHeight: '0.88',
    samples: [{ weight: 400, style: 'normal', text: 'Subtract' }, { weight: 500, style: 'normal', text: 'Subtract' }, { weight: 700, style: 'normal', text: 'Subtract' }] },
  { name: '$text-2xl',  size: '3.5rem',    px: '56px',   label: 'Large display',           letterSpacing: '-0.03em', lineHeight: '0.95',
    samples: [{ weight: 400, style: 'normal', text: 'Design that lasts' }, { weight: 500, style: 'normal', text: 'Design that lasts' }, { weight: 700, style: 'normal', text: 'Design that lasts' }] },
  { name: '$text-xl',   size: '2.625rem',  px: '42px',   label: 'Section heading',         letterSpacing: '-0.025em', lineHeight: '1.05',
    samples: [{ weight: 400, style: 'normal', text: 'Clarity through craft' }, { weight: 500, style: 'normal', text: 'Clarity through craft' }, { weight: 700, style: 'normal', text: 'Clarity through craft' }] },
  { name: '$text-large',size: '1.75rem',   px: '28px',   label: 'Body / editorial',        letterSpacing: '-0.02em', lineHeight: '1.3',
    samples: [{ weight: 400, style: 'normal', text: 'A disciplined approach to visual systems — where every decision is deliberate.' }, { weight: 400, style: 'italic', text: 'A disciplined approach to visual systems — where every decision is deliberate.' }, { weight: 500, style: 'normal', text: 'A disciplined approach to visual systems — where every decision is deliberate.' }] },
  { name: '$text-small',size: '0.8rem',    px: '12.8px', label: 'Labels, meta, captions',  letterSpacing: '-0.01em', lineHeight: '1.4',
    samples: [{ weight: 400, style: 'normal', text: 'Published April 2026  ·  4 min read' }, { weight: 500, style: 'normal', text: 'View all  →' }] },
  { name: '$text-base', size: '1.0625rem', px: '17px',   label: 'UI — buttons, navigation, body', letterSpacing: '-0.015em', lineHeight: '1.5',
    samples: [{ weight: 400, style: 'normal', text: 'The font is set at 17px across body copy, giving text enough room to breathe without feeling oversized.' }, { weight: 500, style: 'normal', text: 'Get started →' }, { weight: 500, style: 'normal', text: 'Work  Writing  About' }] },
]

const spacing = [
  { name: '$space-1',  value: '0.125rem', px: '2px'   },
  { name: '$space-2',  value: '0.25rem',  px: '4px'   },
  { name: '$space-3',  value: '0.375rem', px: '6px'   },
  { name: '$space-4',  value: '0.5rem',   px: '8px'   },
  { name: '$space-5',  value: '0.625rem', px: '10px'  },
  { name: '$space-6',  value: '0.875rem', px: '14px'  },
  { name: '$space-8',  value: '1.0625rem',px: '17px'  },
  { name: '$space-10', value: '1.25rem',  px: '20px'  },
  { name: '$space-12', value: '1.5rem',   px: '24px'  },
  { name: '$space-16', value: '2rem',     px: '32px'  },
  { name: '$space-20', value: '2.5rem',   px: '40px'  },
  { name: '$space-24', value: '3rem',     px: '48px'  },
  { name: '$space-32', value: '4rem',     px: '64px'  },
  { name: '$space-40', value: '5rem',     px: '80px'  },
  { name: '$space-48', value: '6rem',     px: '96px'  },
  { name: '$space-64', value: '8rem',     px: '128px' },
]

const radii = [
  { name: '$radius-micro',  value: '5px'   },
  { name: '$radius-sm',     value: '8px'   },
  { name: '$radius-md',     value: '11px'  },
  { name: '$radius-lg',     value: '12px'  },
  { name: '$radius-pill',   value: '980px' },
  { name: '$radius-circle', value: '50%'   },
]

const transitions = [
  { name: '$transition-fast', value: '$t-micro $ease-hover  — 120ms, hover feedback' },
  { name: '$transition-base', value: '$t-fast $ease-move    — 220ms, standard UI'    },
  { name: '$transition-slow', value: '$t-medium $ease-enter — 320ms, panels/dialogs' },
]

// Saturated tag colors so text + tinted bg are both clearly readable
const DEMO_TAGS: Tag[] = [
  { id: '1', name: 'Design',      color: '#7c3aed' },
  { id: '2', name: 'Engineering', color: '#2563eb' },
  { id: '3', name: 'Urgent',      color: '#dc2626' },
]

const NEW_TAG_COLORS = ['#16a34a', '#ca8a04', '#0891b2', '#db2777', '#7c3aed', '#ea580c']

// ─── Calendar chart demo data — April 2026 daily sign-ups ────────────────────
// Varied distribution so all four bubble sizes (r5/9/15/24) are represented.
// Max is Apr 15 (1 200); normalised thresholds: ≥900 → r24, ≥600 → r15,
// ≥300 → r9, >0 → r5.

const CALENDAR_DATA: CalendarDataPoint[] = [
  { date: '2026-04-01', value:  950 },
  { date: '2026-04-02', value:  650 },
  { date: '2026-04-03', value:  620 },
  { date: '2026-04-04', value:  320 },
  { date: '2026-04-05', value:  260 },
  { date: '2026-04-06', value:  710 },
  { date: '2026-04-07', value: 1100 },
  { date: '2026-04-08', value:  590 },
  { date: '2026-04-09', value:  310 },
  { date: '2026-04-10', value: 1050 },
  { date: '2026-04-11', value:  280 },
  { date: '2026-04-12', value:  270 },
  { date: '2026-04-13', value:  140 },
  { date: '2026-04-14', value:  110 },
  { date: '2026-04-15', value: 1200 },
  { date: '2026-04-16', value:  680 },
  { date: '2026-04-17', value:  980 },
  { date: '2026-04-18', value:  330 },
  { date: '2026-04-19', value:  340 },
  { date: '2026-04-20', value:  350 },
  { date: '2026-04-21', value: 1010 },
  { date: '2026-04-22', value:  320 },
  { date: '2026-04-23', value:  310 },
  { date: '2026-04-24', value:  260 },
  { date: '2026-04-25', value:  170 },
  { date: '2026-04-26', value: 1150 },
  { date: '2026-04-27', value:  960 },
  { date: '2026-04-28', value:  240 },
  { date: '2026-04-29', value:  200 },
  { date: '2026-04-30', value:  180 },
]

// ─── LineChart demo data ──────────────────────────────────────────────────────

const LINE_X = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const LINE_SINGLE: LineSeriesData[] = [
  {
    id: 'rev',
    label: 'Revenue',
    color: '#06D021',
    values: [540, 505, 420, 488, 652, 568, 496],
  },
]

const LINE_MULTI: LineSeriesData[] = [
  { id: 'la', label: 'Los Angeles', color: '#06D021', values: [510, 615, 548, 628, 488, 592, 545] },
  { id: 'ny', label: 'New York',    color: '#38bdf8', values: [400, 462, 378, 448, 492, 418, 430] },
  { id: 'ca', label: 'Canada',      color: '#7c3aed', values: [290, 312, 278, 302, 332, 294, 300] },
  { id: 'cn', label: 'China',       color: '#f59e0b', values: [185, 212, 172, 195, 228, 184, 198] },
]

// ─── SegmentBar demo data ─────────────────────────────────────────────────────

const SEGMENTS: SegmentBarSegment[] = [
  { id: 'direct',   label: 'Direct',   value: 42, color: '#11A0FF' },
  { id: 'organic',  label: 'Organic',  value: 28, color: '#06D021' },
  { id: 'referral', label: 'Referral', value: 18, color: '#FFA811' },
  { id: 'social',   label: 'Social',   value: 12, color: '#7c3aed' },
]

// ─── GanttChart demo data ─────────────────────────────────────────────────────

const GANTT_TASKS: GanttTask[] = [
  { id: 'discovery', label: 'Discovery',   start: 0,  end: 14, color: '#11A0FF' },
  { id: 'design',    label: 'Design',      start: 10, end: 28, color: '#7c3aed' },
  { id: 'dev',       label: 'Development', start: 24, end: 56, color: '#06D021' },
  { id: 'qa',        label: 'QA & Review', start: 50, end: 64, color: '#FFA811' },
  { id: 'launch',    label: 'Launch',      start: 62, end: 70, color: '#FF2111' },
]

// ─── FunnelChart demo data ────────────────────────────────────────────────────

const FUNNEL_STAGES: FunnelStage[] = [
  { label: 'Awareness',   value: 82000, bands: [50, 28, 14, 8] },
  { label: 'Visitors',    value: 21980, bands: [48, 30, 15, 7] },
  { label: 'Leads',       value: 9400,  bands: [45, 30, 16, 9] },
  { label: 'Customers',   value: 3200,  bands: [42, 32, 17, 9] },
]

// ─── BubbleMatrix demo data ───────────────────────────────────────────────────

const BM_ROWS: BubbleMatrixRow[] = [
  { id: 'design',   label: 'Design'      },
  { id: 'eng',      label: 'Engineering' },
  { id: 'product',  label: 'Product'     },
  { id: 'growth',   label: 'Growth'      },
  { id: 'data',     label: 'Data'        },
]

const BM_COLS: BubbleMatrixCol[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
]

const BM_DATA: BubbleMatrixCell[] = [
  { rowId: 'design',  colId: 'mon', value: 42  },
  { rowId: 'design',  colId: 'tue', value: 80  },
  { rowId: 'design',  colId: 'wed', value: 35  },
  { rowId: 'design',  colId: 'thu', value: 65  },
  { rowId: 'design',  colId: 'fri', value: 90  },
  { rowId: 'eng',     colId: 'mon', value: 120 },
  { rowId: 'eng',     colId: 'tue', value: 95  },
  { rowId: 'eng',     colId: 'wed', value: 140 },
  { rowId: 'eng',     colId: 'thu', value: 110 },
  { rowId: 'eng',     colId: 'fri', value: 70  },
  { rowId: 'product', colId: 'mon', value: 55  },
  { rowId: 'product', colId: 'tue', value: 30  },
  { rowId: 'product', colId: 'wed', value: 75  },
  { rowId: 'product', colId: 'thu', value: 90  },
  { rowId: 'product', colId: 'fri', value: 45  },
  { rowId: 'growth',  colId: 'mon', value: 20  },
  { rowId: 'growth',  colId: 'tue', value: 60  },
  { rowId: 'growth',  colId: 'wed', value: 50  },
  { rowId: 'growth',  colId: 'thu', value: 30  },
  { rowId: 'growth',  colId: 'fri', value: 100 },
  { rowId: 'data',    colId: 'mon', value: 85  },
  { rowId: 'data',    colId: 'tue', value: 45  },
  { rowId: 'data',    colId: 'wed', value: 60  },
  { rowId: 'data',    colId: 'thu', value: 140 },
  { rowId: 'data',    colId: 'fri', value: 35  },
]

// ─── DataTable demo data ──────────────────────────────────────────────────────

type TaskRow = {
  id: string
  name: string
  status: 'Todo' | 'In progress' | 'Done' | 'Blocked'
  priority: 'High' | 'Medium' | 'Low'
  tags: Tag[]
  due: string
}

const TASK_ROWS: TaskRow[] = [
  { id: '1', name: 'Homepage redesign',    status: 'In progress', priority: 'High',   tags: [DEMO_TAGS[0]],                    due: 'Jun 12' },
  { id: '2', name: 'API authentication',   status: 'Todo',        priority: 'Medium', tags: [DEMO_TAGS[1]],                    due: 'Jun 15' },
  { id: '3', name: 'Mobile onboarding',    status: 'Done',        priority: 'Low',    tags: [DEMO_TAGS[0], DEMO_TAGS[2]],      due: 'May 28' },
  { id: '4', name: 'Error state handling', status: 'Blocked',     priority: 'High',   tags: [DEMO_TAGS[1]],                    due: 'Jun 8'  },
  { id: '5', name: 'Analytics dashboard',  status: 'In progress', priority: 'Medium', tags: [DEMO_TAGS[2]],                    due: 'Jun 20' },
  { id: '6', name: 'User settings page',   status: 'Todo',        priority: 'Low',    tags: [],                                due: 'Jul 1'  },
  { id: '7', name: 'Export to CSV',        status: 'Done',        priority: 'Low',    tags: [DEMO_TAGS[1]],                    due: 'May 20' },
  { id: '8', name: 'Notification system',  status: 'Todo',        priority: 'High',   tags: [DEMO_TAGS[0], DEMO_TAGS[1]],      due: 'Jun 28' },
]

const STATUS_COLORS: Record<string, string> = {
  'Todo':        'rgba(12,12,12,0.32)',
  'In progress': '#11A0FF',
  'Done':        '#06D021',
  'Blocked':     '#FF2111',
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
  return (
    <span style={{ fontWeight: 500, color: PRIORITY_COLORS[p] ?? 'rgba(12,12,12,0.32)' }}>
      {p}
    </span>
  )
}

function getTaskColumns(size: 'sm' | 'md' = 'sm'): ColumnDef<TaskRow>[] {
  return [
    {
      id: 'name',
      header: 'Task',
      accessorKey: 'name',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      width: 150,
      cell: (v) => renderStatus(v),
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      width: 100,
      cell: (v) => renderPriority(v),
    },
    {
      id: 'tags',
      header: 'Tags',
      accessorKey: 'tags',
      sortable: false,
      cell: (v) => {
        const tags = (v as Tag[]) ?? []
        if (!tags.length) return null
        return (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tags.map(tag => <TagPill key={tag.id} tag={tag} size={size} />)}
          </div>
        )
      },
    },
    {
      id: 'due',
      header: 'Due',
      accessorKey: 'due',
      width: 90,
      align: 'right',
    },
  ]
}

const TASK_COLUMNS = getTaskColumns('sm')

const TASK_ACTIONS: RowAction<TaskRow>[] = [
  { label: 'Edit',      onSelect: (row) => console.log('Edit', row.name) },
  { label: 'Duplicate', onSelect: (row) => console.log('Duplicate', row.name) },
  { separator: true },
  { label: 'Delete', destructive: true, onSelect: (row) => console.log('Delete', row.name) },
]

// ─── Icon groups ──────────────────────────────────────────────────────────────

const iconGroups = [
  { label: 'Actions', icons: [
    { name: 'Plus',               C: Plus },
    { name: 'Minus',              C: Minus },
    { name: 'Check',              C: Check },
    { name: 'X',                  C: X },
    { name: 'Trash',              C: Trash },
    { name: 'PencilSimple',       C: PencilSimple },
    { name: 'Copy',               C: Copy },
    { name: 'DownloadSimple',     C: DownloadSimple },
    { name: 'UploadSimple',       C: UploadSimple },
    { name: 'ShareFat',           C: ShareFat },
    { name: 'Link',               C: Link },
    { name: 'ArrowCounterClockwise', C: ArrowCounterClockwise },
  ]},
  { label: 'Navigation', icons: [
    { name: 'House',              C: House },
    { name: 'ArrowLeft',          C: ArrowLeft },
    { name: 'ArrowRight',         C: ArrowRight },
    { name: 'ArrowUpRight',       C: ArrowUpRight },
    { name: 'MagnifyingGlass',    C: MagnifyingGlass },
    { name: 'CaretDown',          C: CaretDown },
    { name: 'CaretRight',         C: CaretRight },
    { name: 'DotsThree',          C: DotsThree },
    { name: 'DotsThreeVertical',  C: DotsThreeVertical },
    { name: 'Funnel',             C: Funnel },
  ]},
  { label: 'Interface', icons: [
    { name: 'Bell',               C: Bell },
    { name: 'Gear',               C: Gear },
    { name: 'User',               C: User },
    { name: 'Users',              C: Users },
    { name: 'Lock',               C: Lock },
    { name: 'LockOpen',           C: LockOpen },
    { name: 'Eye',                C: Eye },
    { name: 'EyeSlash',           C: EyeSlash },
    { name: 'Star',               C: Star },
    { name: 'BookmarkSimple',     C: BookmarkSimple },
  ]},
  { label: 'Files & Data', icons: [
    { name: 'File',               C: File },
    { name: 'FilePlus',           C: FilePlus },
    { name: 'Folder',             C: Folder },
    { name: 'FolderOpen',         C: FolderOpen },
    { name: 'Image',              C: Image },
    { name: 'Tag',                C: TagIcon },
    { name: 'Database',           C: Database },
    { name: 'ListBullets',        C: ListBullets },
  ]},
  { label: 'Status & Feedback', icons: [
    { name: 'CheckCircle',        C: CheckCircle },
    { name: 'XCircle',            C: XCircle },
    { name: 'Warning',            C: Warning },
    { name: 'Info',               C: Info },
    { name: 'ChatCircle',         C: ChatCircle },
    { name: 'Envelope',           C: Envelope },
    { name: 'At',                 C: At },
    { name: 'Smiley',             C: Smiley },
    { name: 'Sparkle',            C: Sparkle },
    { name: 'Lightning',          C: Lightning },
    { name: 'Rocket',             C: Rocket },
  ]},
]

const ICON_WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'colors' | 'typography' | 'icons' | 'ui' | 'charts' | 'tables' | 'sidebar' | 'chat' | 'board'

const tabs: { id: Tab; label: string }[] = [
  { id: 'colors',     label: 'Colors'     },
  { id: 'typography', label: 'Typography' },
  { id: 'icons',      label: 'Icons'      },
  { id: 'ui',         label: 'UI'         },
  { id: 'charts',     label: 'Charts'     },
  { id: 'tables',     label: 'Tables'     },
  { id: 'sidebar',    label: 'Sidebar'    },
  { id: 'chat',       label: 'Chat'       },
  { id: 'board',      label: 'Board'      },
]

// ─── Page content (needs Suspense for useSearchParams) ────────────────────────

function PageContent() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const activeTab   = (searchParams.get('tab') as Tab) ?? 'colors'

  const [checked1, setChecked1]     = useState(false)
  const [checked2, setChecked2]     = useState(true)
  const [inputVal, setInputVal]     = useState('')
  const [tags, setTags]             = useState<Tag[]>(DEMO_TAGS)
  const [selectedTags, setSelectedTags] = useState<string[]>(['1'])
  const [sliderA, setSliderA]       = useState([40])
  const [sliderB, setSliderB]       = useState([20, 70])
  const [bgModel, setBgModel]       = useState('sonnet')
  const [bgView, setBgView]         = useState('list')

  function setTab(tab: Tab) {
    router.push(`?tab=${tab}`, { scroll: false })
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Subtract Design System</p>
          <h1 className={styles.heroTitle}>SDS</h1>
        </div>

        <TabBar ariaLabel="Design system sections" className={styles.tabBarSpacing}>
          {tabs.map((t) => (
            <Tab key={t.id} active={activeTab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </Tab>
          ))}
        </TabBar>

        {/* ─── Colors ─────────────────────────────────────────────────────── */}
        {activeTab === 'colors' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Colors</h2>
            <div className={styles.colorGrid}>
              {colors.map((c) => (
                <div key={c.name} className={styles.colorSwatch}>
                  <div className={styles.swatchBlock} style={{ background: c.value, outline: c.outline ? '1px solid #dcddd7' : undefined }} />
                  <p className={styles.swatchName}>{c.name}</p>
                  <p className={styles.swatchValue}>{c.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Typography ─────────────────────────────────────────────────── */}
        {activeTab === 'typography' && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Typeface</h2>
              <div className={styles.typefaceCard}>
                <p className={styles.typefaceName}>Indivisible</p>
                <p className={styles.typefaceDetail}>
                  SDS uses a single typeface —{' '}
                  <strong>Indivisible</strong>{' '}by Connary Fagen — across all display and body
                  copy. It ships with the package and is exposed via the CSS variable{' '}
                  <code>--font-indivisible</code>. Both <code>$font-display</code> and{' '}
                  <code>$font-text</code> tokens resolve to it. Available in Regular (400),
                  Medium (500), SemiBold (600 / $weight-bold at 700), and Bold (800) — each with
                  matching italics.
                </p>
              </div>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Type Scale</h2>
              <div className={styles.typeList}>
                {typeScale.map((t) => (
                  <div key={t.name} className={styles.typeScaleEntry}>
                    <div className={styles.typeMeta}>
                      <span className={styles.tokenName}>{t.name}</span>
                      <span className={styles.tokenPx}>{t.px}</span>
                      <span className={styles.tokenDetail}>{t.label}</span>
                    </div>
                    <div className={styles.typeSamples}>
                      {t.samples.map((s, i) => (
                        <p key={i} className={styles.typeSample} style={{ fontSize: t.size, fontWeight: s.weight, fontStyle: s.style, letterSpacing: t.letterSpacing, lineHeight: t.lineHeight }}>
                          {s.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─── Icons ──────────────────────────────────────────────────────── */}
        {activeTab === 'icons' && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Library</h2>
              <p className={styles.iconIntro}>
                SDS uses <strong>Phosphor Icons</strong> — a flexible icon family with six
                weights per glyph. Import from <code>@phosphor-icons/react</code>.
              </p>
              <div className={styles.iconWeightRow}>
                {ICON_WEIGHTS.map((w) => (
                  <div key={w} className={styles.iconWeightItem}>
                    <Star size={28} weight={w} />
                    <span className={styles.tokenDetail}>{w}</span>
                  </div>
                ))}
              </div>
            </section>

            {iconGroups.map((group) => (
              <section key={group.label} className={styles.section}>
                <h2 className={styles.sectionTitle}>{group.label}</h2>
                <div className={styles.iconGrid}>
                  {group.icons.map(({ name, C }) => (
                    <div key={name} className={styles.iconItem}>
                      <C size={20} weight="bold" />
                      <span className={styles.iconName}>{name}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {/* ─── UI ─────────────────────────────────────────────────────────── */}
        {activeTab === 'ui' && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tabs</h2>
              <div className={styles.componentStack}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>border (default)</p>
                  <TabBar ariaLabel="Example tabs">
                    <Tab active>Overview</Tab>
                    <Tab>Activity</Tab>
                    <Tab>Settings</Tab>
                  </TabBar>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>border={'{false}'}</p>
                  <TabBar ariaLabel="Example tabs no border" border={false}>
                    <Tab active>Overview</Tab>
                    <Tab>Activity</Tab>
                    <Tab>Settings</Tab>
                  </TabBar>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Button</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}><p className={styles.tokenName}>primary / md</p><Button variant="primary">Get started</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>secondary / md</p><Button variant="secondary">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>gray / md</p><Button variant="gray">Settings</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>primary / sm</p><Button variant="primary" size="sm">Get started</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>secondary / sm</p><Button variant="secondary" size="sm">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>gray / sm</p><Button variant="gray" size="sm">Settings</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>iconBefore</p><Button variant="secondary" size="sm" iconBefore={<Plus size={14} weight="bold" />}>New item</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>iconAfter</p><Button variant="secondary" size="sm" iconAfter={<ArrowUpRight size={14} weight="bold" />}>Open</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>iconOnly / md</p><Button variant="gray" iconOnly aria-label="Add"><Plus size={18} weight="bold" /></Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>iconOnly / sm</p><Button variant="gray" size="sm" iconOnly aria-label="Add"><Plus size={14} weight="bold" /></Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>split / md</p><Button variant="primary" split>New</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>split / sm</p><Button variant="primary" size="sm" split>New</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>disabled</p><Button variant="primary" disabled>Get started</Button></div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>ButtonGroup</h2>
              <p className={styles.iconIntro}>
                Joins buttons into one connected unit. Use <code>ButtonGroupItem</code> with{' '}
                <code>selected</code> for a single-select segmented control (model
                pickers, view toggles), or drop plain <code>Button</code>s in to cluster
                related actions. Selection uses the system&apos;s blue active state.
              </p>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>single-select / sm</p>
                  <ButtonGroup aria-label="Model">
                    {['Haiku', 'Sonnet', 'Opus'].map((m) => (
                      <ButtonGroupItem key={m} size="sm" selected={bgModel === m.toLowerCase()} onClick={() => setBgModel(m.toLowerCase())}>{m}</ButtonGroupItem>
                    ))}
                  </ButtonGroup>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>single-select / md</p>
                  <ButtonGroup aria-label="View">
                    <ButtonGroupItem selected={bgView === 'list'} onClick={() => setBgView('list')} iconBefore={<ListBullets size={15} weight="bold" />}>List</ButtonGroupItem>
                    <ButtonGroupItem selected={bgView === 'board'} onClick={() => setBgView('board')} iconBefore={<Database size={15} weight="bold" />}>Board</ButtonGroupItem>
                    <ButtonGroupItem selected={bgView === 'cal'} onClick={() => setBgView('cal')} iconBefore={<House size={15} weight="bold" />}>Calendar</ButtonGroupItem>
                  </ButtonGroup>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>action cluster</p>
                  <ButtonGroup aria-label="Text format">
                    <ButtonGroupItem iconOnly size="sm" aria-label="Bold"><strong>B</strong></ButtonGroupItem>
                    <ButtonGroupItem iconOnly size="sm" aria-label="Italic"><em>I</em></ButtonGroupItem>
                    <ButtonGroupItem iconOnly size="sm" aria-label="Copy"><Copy size={14} weight="bold" /></ButtonGroupItem>
                  </ButtonGroup>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>vertical</p>
                  <ButtonGroup orientation="vertical" aria-label="Zoom">
                    <ButtonGroupItem iconOnly size="sm" aria-label="Zoom in"><Plus size={14} weight="bold" /></ButtonGroupItem>
                    <ButtonGroupItem iconOnly size="sm" aria-label="Zoom out"><Minus size={14} weight="bold" /></ButtonGroupItem>
                  </ButtonGroup>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>TextInput</h2>
              <div className={styles.inputDemoGrid}>
                <p className={styles.tokenName}>default</p>
                <p className={styles.tokenName}>type=&quot;date&quot;</p>
                <p className={styles.tokenName}>disabled</p>
                <TextInput placeholder="e.g. Email address" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                <TextInput type="date" />
                <TextInput placeholder="Not editable" disabled />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Slider</h2>
              <div className={styles.componentStack}>

                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>single value — md</p>
                  <div style={{ width: 320 }}>
                    <Slider value={sliderA} onValueChange={setSliderA} aria-label="Volume" />
                  </div>
                  <p className={styles.tokenDetail}>{sliderA[0]}</p>
                </div>

                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>range — md</p>
                  <div style={{ width: 320 }}>
                    <Slider value={sliderB} onValueChange={setSliderB} aria-label="Range" />
                  </div>
                  <p className={styles.tokenDetail}>{sliderB[0]} – {sliderB[1]}</p>
                </div>

                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>step=10</p>
                  <div style={{ width: 320 }}>
                    <Slider defaultValue={[30]} step={10} aria-label="Step" />
                  </div>
                </div>

                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>disabled</p>
                  <div style={{ width: 320 }}>
                    <Slider defaultValue={[55]} disabled aria-label="Disabled" />
                  </div>
                </div>

              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>ChecklistItem</h2>
              <div className={styles.componentPreviewBox}>
                <ChecklistItem checked={checked1} onCheckedChange={setChecked1}>Create 1:1 docs for all the 1:1s I&rsquo;m doing next week</ChecklistItem>
                <ChecklistItem checked={checked2} done={checked2} onCheckedChange={setChecked2}>Create a draft plan for manager 1:1 Monday</ChecklistItem>
                <ChecklistItem checked={false} trailing={<span style={{ fontSize: '0.75rem', color: 'rgba(12,12,12,0.4)' }}>···</span>}>With a trailing actions slot</ChecklistItem>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dialog</h2>
              <div className={styles.componentRow}>
                {(['sm', 'md', 'lg'] as const).map((w) => (
                  <div key={w} className={styles.componentGroup}>
                    <p className={styles.tokenName}>{w}</p>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="gray" size="sm" iconAfter={<ArrowUpRight size={13} weight="bold" />}>Open {w} dialog</Button></DialogTrigger>
                      <DialogContent width={w}>
                        <DialogHeader title={`${w.toUpperCase()} dialog`} />
                        <DialogBody><p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.5 }}>Dialog variant — {w}.</p></DialogBody>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>ExpandPanel</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>full-screen expand</p>
                  <ExpandPanel>
                    <ExpandPanelTrigger asChild><Button variant="gray" size="sm" iconAfter={<ArrowUpRight size={14} weight="bold" />}>Open panel</Button></ExpandPanelTrigger>
                    <ExpandPanelContent title="Work — Stripe">
                      <ExpandPanelBody narrow>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.6 }}>
                          Full-screen overlay with scale + translate entrance using <code style={{ fontFamily: 'monospace', fontSize: '0.85em', background: '#f3f3f3', padding: '1px 5px', borderRadius: 4 }}>$ease-glide</code> over <code style={{ fontFamily: 'monospace', fontSize: '0.85em', background: '#f3f3f3', padding: '1px 5px', borderRadius: 4 }}>$t-slow</code>.
                        </p>
                      </ExpandPanelBody>
                    </ExpandPanelContent>
                  </ExpandPanel>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DropdownMenu</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>default</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="gray" size="sm" iconAfter={<CaretDown size={12} weight="bold" />}>Open menu</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>TagSelector</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>inline pills</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {DEMO_TAGS.map((t) => <TagPill key={t.id} tag={t} />)}
                  </div>
                </div>
                <div className={styles.componentGroup} style={{ width: 280 }}>
                  <p className={styles.tokenName}>selector popover</p>
                  <TagSelector
                    tags={tags}
                    selected={selectedTags}
                    onSelect={(id) => setSelectedTags((prev) => [...prev, id])}
                    onDeselect={(id) => setSelectedTags((prev) => prev.filter((x) => x !== id))}
                    onCreate={async (name) => {
                      const newTag: Tag = { id: String(Date.now()), name, color: NEW_TAG_COLORS[tags.length % NEW_TAG_COLORS.length] }
                      setTags((prev) => [...prev, newTag])
                      return newTag
                    }}
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Footer</h2>
              <div className={styles.componentStack}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>with nav links</p>
                  <div className={styles.componentPreview}>
                    <Footer copyright="© 2026 Subtract" navLinks={[{ href: '/writing', label: 'Writing' }, { href: '/about', label: 'About' }, { href: 'https://github.com', label: 'GitHub', external: true }]} />
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Spacing</h2>
              <div className={styles.spacingList}>
                {spacing.map((s) => (
                  <div key={s.name} className={styles.spacingRow}>
                    <span className={styles.tokenName}>{s.name}</span>
                    <div className={styles.spacingBar}><div className={styles.spacingFill} style={{ width: s.value }} /></div>
                    <span className={styles.tokenDetail}>{s.px}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Border Radius</h2>
              <div className={styles.radiusGrid}>
                {radii.map((r) => (
                  <div key={r.name} className={styles.radiusItem}>
                    <div className={styles.radiusBlock} style={{ borderRadius: r.value }} />
                    <p className={styles.swatchName}>{r.name}</p>
                    <p className={styles.swatchValue}>{r.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Transitions</h2>
              <div className={styles.transitionGrid}>
                {transitions.map((t) => (
                  <div key={t.name} className={styles.transitionRow}>
                    <span className={styles.tokenName}>{t.name}</span>
                    <span className={styles.tokenDetail}>{t.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─── Charts ─────────────────────────────────────────────────────── */}
        {activeTab === 'charts' && (
          <>
            <ChartTooltipPreview />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>LineChart</h2>
              <p className={styles.chartIntro}>
                Multi-series line chart with smooth Catmull-Rom curves, 3px
                strokes, and a 6-layer CSS drop-shadow glow per the Figma spec.
                Area fill uses a gradient + optional dot texture (single series
                default). Right-side callout shows the series label and last
                value formatted via <code>valueFormat</code>. Pass{' '}
                <code>dates</code> for automatic month labels on the x-axis.
                Y-axis always clips; pass <code>showYAxis=false</code> for
                compact card usage.
              </p>
              <div className={styles.chartStack}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>single series — dots + glow</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={LINE_SINGLE}
                      xLabels={LINE_X}
                      height={260}
                      uid="lc-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>multi-series — 4 series</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={LINE_MULTI}
                      xLabels={LINE_X}
                      height={300}
                      uid="lc-b"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>dates prop — auto month labels, showYAxis=false</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={[{
                        id: 'daily',
                        label: 'Sign-ups',
                        color: '#06D021',
                        values: CALENDAR_DATA.map(d => d.value),
                      }]}
                      dates={CALENDAR_DATA.map(d => d.date)}
                      showYAxis={false}
                      valueFormat={(v) => String(v)}
                      height={160}
                      uid="lc-c"
                    />
                  </div>
                </div>

              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>BubbleMatrix — calendar mode</h2>
              <p className={styles.chartIntro}>
                Calendar bubble chart where each day is represented by one of
                four discrete bubble sizes (r5 / r9 / r15 / r24) scaled to the
                month&rsquo;s peak value. Larger bubbles carry a soft radial
                glow; days outside the displayed month are shown as faint date
                numbers. Pass <code>calendarData</code> to activate calendar mode.
                Demo: April 2026 daily sign-ups.
              </p>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>calendarData — width=360, default color</p>
                  <div className={styles.calendarWrap}>
                    <BubbleMatrix
                      calendarData={CALENDAR_DATA}
                      month={new Date(2026, 3)}
                      width={360}
                      uid="cal-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>width=480, color=&ldquo;$blue&rdquo;</p>
                  <div className={styles.calendarWrap}>
                    <BubbleMatrix
                      calendarData={CALENDAR_DATA}
                      month={new Date(2026, 3)}
                      color="#11A0FF"
                      width={480}
                      uid="cal-b"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* ─── SegmentBar ──────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>SegmentBar</h2>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>default — 4 segments with gap</p>
                  <div className={styles.chartWrap}>
                    <SegmentBar segments={SEGMENTS} width={520} uid="sb-a" />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>height=12, gap=1, radius=4 — compact pill</p>
                  <div className={styles.chartWrap}>
                    <SegmentBar segments={SEGMENTS} width={520} height={12} gap={1} radius={4} uid="sb-b" />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>gap=0 — flush segments</p>
                  <div className={styles.chartWrap}>
                    <SegmentBar segments={SEGMENTS} width={520} gap={0} uid="sb-c" />
                  </div>
                </div>

              </div>
            </section>

            {/* ─── GanttChart ──────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>GanttChart</h2>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>default — labels + axis</p>
                  <div className={styles.chartWrap}>
                    <GanttChart
                      tasks={GANTT_TASKS}
                      width={520}
                      valueFormat={v => `Day ${v}`}
                      uid="gc-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>sparkline=true</p>
                  <div className={styles.chartWrap}>
                    <GanttChart
                      tasks={GANTT_TASKS}
                      width={520}
                      height={80}
                      sparkline
                      uid="gc-b"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* ─── LineChart sparkline ─────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>LineChart — sparkline</h2>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>sparkline=true, single series</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={LINE_SINGLE}
                      sparkline
                      width={520}
                      height={80}
                      uid="lc-sp-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>sparkline=true, multi-series</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={LINE_MULTI}
                      sparkline
                      width={520}
                      height={80}
                      uid="lc-sp-b"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* ─── FunnelChart ─────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>FunnelChart</h2>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>purple — 4 stages, 4 bands</p>
                  <div className={styles.chartWrap}>
                    <FunnelChart
                      stages={FUNNEL_STAGES}
                      color="#7c3aed"
                      width={520}
                      height={240}
                      valueFormat={v => v.toLocaleString()}
                      uid="fc-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>blue — 4 stages, layerCount=5</p>
                  <div className={styles.chartWrap}>
                    <FunnelChart
                      stages={FUNNEL_STAGES}
                      color="#11A0FF"
                      layerCount={5}
                      width={520}
                      height={240}
                      valueFormat={v => v.toLocaleString()}
                      uid="fc-b"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* ─── BubbleMatrix ────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>BubbleMatrix</h2>
              <div className={styles.chartGrid}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>default — 5 rows × 5 cols</p>
                  <div className={styles.chartWrap}>
                    <BubbleMatrix
                      rows={BM_ROWS}
                      cols={BM_COLS}
                      data={BM_DATA}
                      width={400}
                      uid="bm-a"
                    />
                  </div>
                </div>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>green — no labels or headers</p>
                  <div className={styles.chartWrap}>
                    <BubbleMatrix
                      rows={BM_ROWS}
                      cols={BM_COLS}
                      data={BM_DATA}
                      color="#06D021"
                      width={280}
                      labelWidth={0}
                      showLabels={false}
                      showHeaders={false}
                      uid="bm-b"
                    />
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

        {/* ─── Tables ─────────────────────────────────────────────────────── */}
        {activeTab === 'tables' && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DataTable</h2>
              <p className={styles.chartIntro}>
                Generic sortable table with row selection, tag cells, status
                badges, and a per-row overflow menu. Columns are sortable by
                default when they have an accessor key — pass{' '}
                <code>sortable={'{false}'}</code> to opt out. Row actions accept
                a static array or a per-row function.
              </p>
              <DataTable
                columns={TASK_COLUMNS}
                data={TASK_ROWS}
                getRowId={(row) => row.id}
                rowActions={TASK_ACTIONS}
                selectable
                defaultSortId="name"
              />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DataTable — size=&quot;md&quot;</h2>
              <p className={styles.chartIntro}>
                Uses <code>$text-base</code> for headers, cells, and empty state.
                Default <code>size=&quot;sm&quot;</code> uses <code>$text-small</code>.
              </p>
              <DataTable
                columns={getTaskColumns('md')}
                data={TASK_ROWS}
                getRowId={(row) => row.id}
                rowActions={TASK_ACTIONS}
                selectable
                size="md"
                defaultSortId="name"
              />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DataTable — no selection or actions</h2>
              <DataTable
                columns={TASK_COLUMNS.filter(c => c.id !== 'tags')}
                data={TASK_ROWS}
                getRowId={(row) => row.id}
                defaultSortId="priority"
                defaultSortDirection="desc"
              />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DataTable — empty state</h2>
              <DataTable
                columns={TASK_COLUMNS}
                data={[]}
                emptyMessage="No tasks found. Create one to get started."
              />
            </section>
          </>
        )}

        {/* ─── Sidebar ────────────────────────────────────────────────────── */}
        {activeTab === 'sidebar' && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Sidebar</h2>
              <p className={styles.chartIntro}>
                Composable left-side navigation: <code>Sidebar</code> with{' '}
                <code>SidebarHeader</code>, <code>SidebarContent</code>, and{' '}
                <code>SidebarFooter</code>. Groups items with{' '}
                <code>SidebarGroup</code> + <code>SidebarGroupLabel</code>.
                Items render as <code>Link</code> when an <code>href</code> is
                passed, or as <code>button</code> otherwise. Each{' '}
                <code>SidebarItem</code> can include an{' '}
                <code>icon</code> (any node — typically a Phosphor icon),{' '}
                an <code>avatar</code> (image URL or node), a{' '}
                <code>description</code>, and a <code>trailing</code> slot.
              </p>

              <div className={styles.sidebarDemoGrid}>
                {/* Inset (default) */}
                <div className={styles.sidebarDemo}>
                  <p className={styles.sidebarDemoLabel}>variant=&quot;inset&quot; — flush against page content</p>
                  <div className={styles.sidebarDemoFrame}>
                    <Sidebar>
                      <SidebarHeader>
                        <div className={styles.sidebarBrandRow}>
                          <div className={styles.sidebarBrandMark}>S</div>
                          <div className={styles.sidebarBrandText}>
                            <strong>Subtract</strong>
                            <span>thomas@subtract.design</span>
                          </div>
                          <CaretUpDown size={14} weight="bold" />
                        </div>
                      </SidebarHeader>

                      <SidebarContent>
                        <SidebarGroup>
                          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                          <SidebarMenu>
                            <SidebarItem icon={<House size={16} weight="bold" />} label="Home" href="#home" active />
                            <SidebarItem icon={<Tray size={16} weight="bold" />} label="Tray" trailing="12" href="#inbox" />
                            <SidebarItem icon={<ChartLine size={16} weight="bold" />} label="Insights" href="#insights" />
                            <SidebarItem icon={<Calendar size={16} weight="bold" />} label="Calendar" href="#calendar" />
                            <SidebarItem icon={<Folder size={16} weight="bold" />} label="Projects" trailing={<CaretRight size={12} weight="bold" />} href="#projects" />
                          </SidebarMenu>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                          <SidebarGroupLabel action={<Plus size={12} weight="bold" />}>Tags</SidebarGroupLabel>
                          <SidebarMenu>
                            <SidebarItem icon={<TagIcon size={16} weight="bold" style={{ color: '#11A0FF' }} />} label="Design" trailing="24" href="#t-design" />
                            <SidebarItem icon={<TagIcon size={16} weight="bold" style={{ color: '#06D021' }} />} label="Engineering" trailing="18" href="#t-eng" />
                            <SidebarItem icon={<TagIcon size={16} weight="bold" style={{ color: '#FFA811' }} />} label="Product" trailing="7" href="#t-product" />
                            <SidebarItem icon={<TagIcon size={16} weight="bold" style={{ color: '#9333ea' }} />} label="Research" trailing="3" href="#t-research" />
                          </SidebarMenu>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                          <SidebarGroupLabel>Team</SidebarGroupLabel>
                          <SidebarMenu>
                            <SidebarItem avatar="https://i.pravatar.cc/64?img=12" label="Maya Chen" description="Designer" trailing={<span className={styles.sidebarStatusDot} />} href="#u-maya" />
                            <SidebarItem avatar="https://i.pravatar.cc/64?img=14" label="Jordan Reyes" description="Engineering" href="#u-jordan" />
                            <SidebarItem avatar="https://i.pravatar.cc/64?img=32" label="Sasha Park" description="Product" href="#u-sasha" />
                            <SidebarItem icon={<Users size={16} weight="bold" />} label="Invite members" size="sm" href="#invite" />
                          </SidebarMenu>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                          <SidebarGroupLabel>Support</SidebarGroupLabel>
                          <SidebarMenu>
                            <SidebarItem icon={<Lifebuoy size={16} weight="bold" />} label="Help &amp; docs" href="#help" />
                            <SidebarItem icon={<Question size={16} weight="bold" />} label="Send feedback" onClick={() => alert('Feedback!')} />
                            <SidebarItem icon={<Gear size={16} weight="bold" />} label="Settings" href="#settings" />
                            <SidebarItem icon={<SignOut size={16} weight="bold" />} label="Disabled item" disabled href="#x" />
                          </SidebarMenu>
                        </SidebarGroup>
                      </SidebarContent>

                      <SidebarFooter>
                        <SidebarItem
                          avatar="https://i.pravatar.cc/64?img=68"
                          label="Thomas Drach"
                          description="thomas@subtract.design"
                          trailing={<DotsThreeVertical size={14} weight="bold" />}
                          onClick={() => {}}
                        />
                      </SidebarFooter>
                    </Sidebar>
                    <div className={styles.sidebarDemoStage}>
                      <span>Page content</span>
                    </div>
                  </div>
                </div>

                {/* Floating */}
                <div className={styles.sidebarDemo}>
                  <p className={styles.sidebarDemoLabel}>variant=&quot;floating&quot; — card-style with shadow</p>
                  <div className={styles.sidebarDemoFrame}>
                    <Sidebar variant="floating">
                      <SidebarHeader>
                        <div className={styles.sidebarBrandRow}>
                          <div className={styles.sidebarBrandMark} style={{ background: '#11A0FF' }}>C</div>
                          <div className={styles.sidebarBrandText}>
                            <strong>ClawMachine</strong>
                            <span>Personal OS</span>
                          </div>
                        </div>
                      </SidebarHeader>

                      <SidebarContent>
                        <SidebarMenu>
                          <SidebarItem icon={<House size={16} weight="bold" />} label="Dashboard" href="#1" active />
                          <SidebarItem icon={<ListBullets size={16} weight="bold" />} label="Tasks" trailing="3" href="#2" />
                          <SidebarItem icon={<File size={16} weight="bold" />} label="Notes" href="#3" />
                          <SidebarItem icon={<Database size={16} weight="bold" />} label="Data" href="#4" />
                        </SidebarMenu>

                        <SidebarGroup>
                          <SidebarGroupLabel>Nested</SidebarGroupLabel>
                          <SidebarMenu>
                            <SidebarItem icon={<FolderOpen size={16} weight="bold" />} label="Documents" href="#d1" />
                            <SidebarItem label="Reports" href="#d2" indent={1} size="sm" />
                            <SidebarItem label="Invoices" href="#d3" indent={1} size="sm" active />
                            <SidebarItem label="Receipts" href="#d4" indent={1} size="sm" />
                            <SidebarItem label="2024 archive" href="#d5" indent={2} size="sm" />
                          </SidebarMenu>
                        </SidebarGroup>
                      </SidebarContent>

                      <SidebarFooter>
                        <SidebarItem
                          icon={<Wrench size={16} weight="bold" />}
                          label="Settings"
                          size="sm"
                          href="#settings2"
                        />
                      </SidebarFooter>
                    </Sidebar>
                    <div className={styles.sidebarDemoStage}>
                      <span>Page content</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>SidebarItem variants</h2>
              <p className={styles.chartIntro}>
                The list item primitive supports icon, avatar, description, and
                trailing slots — and can render as either a <code>Link</code>{' '}
                (when given an <code>href</code>) or a <code>button</code>.
              </p>
              <div className={styles.sidebarItemShowcase}>
                <SidebarMenu>
                  <SidebarItem icon={<House size={16} weight="bold" />} label="Icon only" href="#a" />
                  <SidebarItem icon={<Tray size={16} weight="bold" />} label="Icon + trailing" trailing="42" href="#b" />
                  <SidebarItem icon={<Bell size={16} weight="bold" />} label="Active state" href="#c" active />
                  <SidebarItem icon={<ChartLine size={16} weight="bold" />} label="With description" description="Daily metrics &amp; trends" href="#d" />
                  <SidebarItem avatar="https://i.pravatar.cc/64?img=5" label="Avatar — image URL" description="thomas@subtract.design" href="#e" />
                  <SidebarItem avatar={<span style={{ background: '#11A0FF', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>TD</span>} label="Avatar — custom node" href="#f" />
                  <SidebarItem icon={<Trash size={16} weight="bold" />} label="Disabled" disabled href="#g" />
                  <SidebarItem icon={<Lightning size={16} weight="bold" />} label="Small size" size="sm" href="#h" />
                  <SidebarItem label="No icon, indent 1" href="#i" indent={1} size="sm" />
                  <SidebarItem label="No icon, indent 2" href="#j" indent={2} size="sm" />
                </SidebarMenu>
              </div>
            </section>
          </>
        )}

        {/* ─── Chat ───────────────────────────────────────────────────────── */}
        {activeTab === 'chat' && <ChatShowcase />}

        {/* ─── Board ──────────────────────────────────────────────────────── */}
        {activeTab === 'board' && <BoardShowcase />}
      </main>

      <Footer copyright="© 2026 Subtract" navLinks={[{ href: '/writing', label: 'Writing' }, { href: '/about', label: 'About' }, { href: 'https://github.com', label: 'GitHub', external: true }]} />
    </>
  )
}

// ─── Suspense wrapper required for useSearchParams ────────────────────────────
export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  )
}
