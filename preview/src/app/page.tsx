'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Button, Footer, TextInput, ChecklistItem,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  TagSelector, TagPill,
  ExpandPanel, ExpandPanelTrigger, ExpandPanelContent, ExpandPanelBody,
  WeightChart,
  TabBar, Tab,
  CalendarChart,
  LineChart,
} from '@subtract/ds'
import type { Tag, WeightDataPoint, CalendarDataPoint, LineSeriesData } from '@subtract/ds'
import {
  Plus, Minus, Check, X, Trash, PencilSimple, Copy, DownloadSimple, UploadSimple,
  ShareFat, Link, ArrowCounterClockwise, Funnel,
  House, ArrowLeft, ArrowRight, MagnifyingGlass, CaretDown, CaretRight,
  DotsThree, DotsThreeVertical, ArrowUpRight,
  Bell, Gear, User, Users, Lock, LockOpen, Eye, EyeSlash, Star, BookmarkSimple,
  File, FilePlus, Folder, FolderOpen, Image, Tag as TagIcon, Database, ListBullets,
  ChatCircle, Envelope, At, Warning, Info, CheckCircle, XCircle,
  Smiley, Sparkle, Rocket, Lightning,
} from '@phosphor-icons/react'
import styles from './page.module.scss'

// ─── Data ─────────────────────────────────────────────────────────────────────

const colors = [
  { name: '$black',       value: '#0c0c0c',                  dark: true  },
  { name: '$light',       value: '#f3f3f3',                  dark: false },
  { name: '$white',       value: '#ffffff',                  dark: false },
  { name: '$demure',      value: '#dcddd7',                  dark: false },
  { name: '$blue',        value: '#0035ff',                  dark: true  },
  { name: '$error',       value: '#c13535',                  dark: true  },
  { name: '$ink-dark',    value: '#0c0c0c',                  dark: true  },
  { name: '$ink-light',   value: '#ffffff',                  dark: false, outline: true },
  { name: '$muted-dark',  value: 'rgba(12, 12, 12, 0.48)',   dark: true  },
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

// ─── Chart demo data — monthly payment volume ($B) ────────────────────────────
// 24 months of payment processing data. Primary series = total volume ($B);
// secondary series (sparse, quarterly) = decline rate % (improving over time
// as fraud models mature). Derived = net settled volume = volume × (1 − rate%).

function makeDate(monthsAgo: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  d.setDate(1)
  return d.toISOString().split('T')[0]
}

const CHART_DATA: WeightDataPoint[] = [
  { date: makeDate(23), weight_lbs:  18.4, body_fat:  4.80 },
  { date: makeDate(22), weight_lbs:  21.2, body_fat:  null  },
  { date: makeDate(21), weight_lbs:  24.8, body_fat:  null  },
  { date: makeDate(20), weight_lbs:  28.1, body_fat:  4.20 },
  { date: makeDate(19), weight_lbs:  31.6, body_fat:  null  },
  { date: makeDate(18), weight_lbs:  35.0, body_fat:  null  },
  { date: makeDate(17), weight_lbs:  39.4, body_fat:  3.65 },
  { date: makeDate(16), weight_lbs:  43.8, body_fat:  null  },
  { date: makeDate(15), weight_lbs:  48.2, body_fat:  null  },
  { date: makeDate(14), weight_lbs:  52.9, body_fat:  3.10 },
  { date: makeDate(13), weight_lbs:  57.4, body_fat:  null  },
  { date: makeDate(12), weight_lbs:  63.1, body_fat:  null  },
  { date: makeDate(11), weight_lbs:  68.8, body_fat:  2.62 },
  { date: makeDate(10), weight_lbs:  74.6, body_fat:  null  },
  { date: makeDate(9),  weight_lbs:  81.3, body_fat:  null  },
  { date: makeDate(8),  weight_lbs:  88.5, body_fat:  2.18 },
  { date: makeDate(7),  weight_lbs:  96.2, body_fat:  null  },
  { date: makeDate(6),  weight_lbs: 104.7, body_fat:  null  },
  { date: makeDate(5),  weight_lbs: 113.8, body_fat:  1.74 },
  { date: makeDate(4),  weight_lbs: 120.4, body_fat:  null  },
  { date: makeDate(3),  weight_lbs: 128.1, body_fat:  null  },
  { date: makeDate(2),  weight_lbs: 135.6, body_fat:  1.38 },
  { date: makeDate(1),  weight_lbs: 142.9, body_fat:  null  },
  { date: makeDate(0),  weight_lbs: 151.2, body_fat:  1.10 },
]

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
    color: '#16a34a',
    values: [540, 505, 420, 488, 652, 568, 496],
  },
]

const LINE_MULTI: LineSeriesData[] = [
  { id: 'la', label: 'Los Angeles', color: '#16a34a', values: [510, 615, 548, 628, 488, 592, 545] },
  { id: 'ny', label: 'New York',    color: '#38bdf8', values: [400, 462, 378, 448, 492, 418, 430] },
  { id: 'ca', label: 'Canada',      color: '#7c3aed', values: [290, 312, 278, 302, 332, 294, 300] },
  { id: 'cn', label: 'China',       color: '#f59e0b', values: [185, 212, 172, 195, 228, 184, 198] },
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

type Tab = 'colors' | 'typography' | 'icons' | 'ui' | 'charts'

const tabs: { id: Tab; label: string }[] = [
  { id: 'colors',     label: 'Colors'     },
  { id: 'typography', label: 'Typography' },
  { id: 'icons',      label: 'Icons'      },
  { id: 'ui',         label: 'UI'         },
  { id: 'charts',     label: 'Charts'     },
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
                  Medium (500), and Bold (700) — each with matching italics.
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
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>WeightChart</h2>
              <p className={styles.chartIntro}>
                SVG ribbon chart for a primary value with confidence band,
                plus two optional overlay series. Demo: 24 months of payment
                processing volume ($B) — total volume (ribbon), decline rate %
                measured quarterly (dashed amber, sparse), and net settled
                volume (green). Both series trend in opposite directions as
                fraud models improve alongside growth.
              </p>

              <div className={styles.chartStack}>

                {/* Full-height — expanded view */}
                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>height=200 — expanded</p>
                  <div className={styles.chartWrap}>
                    <WeightChart data={CHART_DATA} width={860} height={200} uid="preview-lg" />
                  </div>
                  <div className={styles.chartLegend}>
                    <span className={styles.legendWeight}>Total volume ($B)</span>
                    <span className={styles.legendLean}>Net settled volume</span>
                    <span className={styles.legendFat}>Decline rate %</span>
                  </div>
                </div>

                {/* Compact card height */}
                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>height=90 — card</p>
                  <div className={styles.chartWrap}>
                    <WeightChart data={CHART_DATA} width={440} height={90} uid="preview-sm" />
                  </div>
                </div>

                {/* Primary series only */}
                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>primary series only (no overlay)</p>
                  <div className={styles.chartWrap}>
                    <WeightChart
                      data={CHART_DATA.map(d => ({ ...d, body_fat: null }))}
                      width={440}
                      height={90}
                      uid="preview-wo"
                    />
                  </div>
                </div>

              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>LineChart</h2>
              <p className={styles.chartIntro}>
                Multi-series line chart with smooth Catmull-Rom curves, 4px
                strokes, and a 6-layer CSS drop-shadow glow per the Figma spec.
                Area fill uses a gradient + optional dot texture (single series
                default). Right-side callout shows the series label and last
                value. Y-axis ticks auto-computed to nice round intervals.
              </p>
              <div className={styles.chartStack}>

                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>single series — dots + glow</p>
                  <div className={styles.chartWrap}>
                    <LineChart
                      series={LINE_SINGLE}
                      xLabels={LINE_X}
                      width={720}
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
                      width={720}
                      height={300}
                      uid="lc-b"
                    />
                  </div>
                </div>

              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>CalendarChart</h2>
              <p className={styles.chartIntro}>
                Calendar bubble chart where each day is represented by one of
                four discrete bubble sizes (r5 / r9 / r15 / r24) scaled to the
                month&rsquo;s peak value. Larger bubbles carry a soft radial
                glow; days outside the displayed month are shown as faint date
                numbers. Demo: April 2026 daily sign-ups.
              </p>
              <div className={styles.chartStack}>

                {/* Default width */}
                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>width=360 — default</p>
                  <div className={styles.calendarWrap}>
                    <CalendarChart
                      data={CALENDAR_DATA}
                      month={new Date(2026, 3)}
                      width={360}
                      uid="cal-a"
                    />
                  </div>
                </div>

                {/* Wider, with alt color */}
                <div className={styles.chartDemo}>
                  <p className={styles.tokenName}>width=480, color=&ldquo;$blue&rdquo;</p>
                  <div className={styles.calendarWrap}>
                    <CalendarChart
                      data={CALENDAR_DATA}
                      month={new Date(2026, 3)}
                      color="#0035ff"
                      width={480}
                      uid="cal-b"
                    />
                  </div>
                </div>

              </div>
            </section>
          </>
        )}
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
