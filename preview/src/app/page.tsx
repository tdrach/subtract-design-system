'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Button, Footer, TextInput, ChecklistItem,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  TagSelector, TagPill,
  ExpandPanel, ExpandPanelTrigger, ExpandPanelContent, ExpandPanelBody,
} from '@subtract/ds'
import type { Tag } from '@subtract/ds'
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

type Tab = 'colors' | 'typography' | 'icons' | 'ui'

const tabs: { id: Tab; label: string }[] = [
  { id: 'colors',     label: 'Colors'     },
  { id: 'typography', label: 'Typography' },
  { id: 'icons',      label: 'Icons'      },
  { id: 'ui',         label: 'UI'         },
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

        <nav className={styles.tabBar} role="tablist" aria-label="Design system sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

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
                      <C size={20} weight="regular" />
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
              <h2 className={styles.sectionTitle}>Button</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}><p className={styles.tokenName}>primary / md</p><Button variant="primary">Get started</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>secondary / md</p><Button variant="secondary">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>gray / md</p><Button variant="gray">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>primary / sm</p><Button variant="primary" size="sm">Get started</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>secondary / sm</p><Button variant="secondary" size="sm">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>gray / sm</p><Button variant="gray" size="sm">Learn more</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>split / md</p><Button variant="primary" split>New</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>split / sm</p><Button variant="primary" size="sm" split>New</Button></div>
                <div className={styles.componentGroup}><p className={styles.tokenName}>disabled</p><Button variant="primary" disabled>Get started</Button></div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>TextInput</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup} style={{ width: 240 }}><p className={styles.tokenName}>default</p><TextInput placeholder="e.g. Email address" value={inputVal} onChange={(e) => setInputVal(e.target.value)} /></div>
                <div className={styles.componentGroup} style={{ width: 240 }}><p className={styles.tokenName}>type="date"</p><TextInput type="date" /></div>
                <div className={styles.componentGroup} style={{ width: 240 }}><p className={styles.tokenName}>disabled</p><TextInput placeholder="Not editable" disabled /></div>
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
                      <DialogTrigger asChild><Button variant="gray" size="sm">Open {w} dialog</Button></DialogTrigger>
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
                    <ExpandPanelTrigger asChild><Button variant="gray" size="sm">Open panel ↗</Button></ExpandPanelTrigger>
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
                    <DropdownMenuTrigger asChild><Button variant="gray" size="sm">Open menu ↓</Button></DropdownMenuTrigger>
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
