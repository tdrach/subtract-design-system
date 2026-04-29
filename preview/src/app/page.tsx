'use client'

import { useState } from 'react'
import {
  Button,
  Footer,
  TextInput,
  ChecklistItem,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  TagSelector,
  TagPill,
} from '@subtract/ds'
import type { Tag } from '@subtract/ds'
import styles from './page.module.scss'

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
  {
    name: '$text-3xl',
    size: '9rem',
    px: '144px',
    label: 'Hero title',
    letterSpacing: '-0.07em',
    lineHeight: '0.88',
    samples: [
      { weight: 400, style: 'normal', text: 'Subtract' },
      { weight: 500, style: 'normal', text: 'Subtract' },
      { weight: 700, style: 'normal', text: 'Subtract' },
    ],
  },
  {
    name: '$text-2xl',
    size: '3.5rem',
    px: '56px',
    label: 'Large display',
    letterSpacing: '-0.03em',
    lineHeight: '0.95',
    samples: [
      { weight: 400, style: 'normal', text: 'Design that lasts' },
      { weight: 500, style: 'normal', text: 'Design that lasts' },
      { weight: 700, style: 'normal', text: 'Design that lasts' },
    ],
  },
  {
    name: '$text-xl',
    size: '2.625rem',
    px: '42px',
    label: 'Section heading',
    letterSpacing: '-0.025em',
    lineHeight: '1.05',
    samples: [
      { weight: 400, style: 'normal', text: 'Clarity through craft' },
      { weight: 500, style: 'normal', text: 'Clarity through craft' },
      { weight: 700, style: 'normal', text: 'Clarity through craft' },
    ],
  },
  {
    name: '$text-large',
    size: '1.75rem',
    px: '28px',
    label: 'Body / editorial',
    letterSpacing: '-0.02em',
    lineHeight: '1.3',
    samples: [
      { weight: 400, style: 'normal', text: 'A disciplined approach to visual systems — where every decision is deliberate.' },
      { weight: 400, style: 'italic', text: 'A disciplined approach to visual systems — where every decision is deliberate.' },
      { weight: 500, style: 'normal', text: 'A disciplined approach to visual systems — where every decision is deliberate.' },
    ],
  },
  {
    name: '$text-small',
    size: '0.8rem',
    px: '12.8px',
    label: 'Labels, meta, captions',
    letterSpacing: '-0.01em',
    lineHeight: '1.4',
    samples: [
      { weight: 400, style: 'normal', text: 'Published April 2026  ·  4 min read' },
      { weight: 500, style: 'normal', text: 'View all  →' },
    ],
  },
  {
    name: '$text-base',
    size: '1.0625rem',
    px: '17px',
    label: 'UI — buttons, navigation, body',
    letterSpacing: '-0.015em',
    lineHeight: '1.5',
    samples: [
      { weight: 400, style: 'normal', text: 'The font is set at 17px across body copy, giving text enough room to breathe without feeling oversized.' },
      { weight: 500, style: 'normal', text: 'Get started →' },
      { weight: 500, style: 'normal', text: 'Work  Writing  About' },
    ],
  },
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

const DEMO_TAGS: Tag[] = [
  { id: '1', name: 'Design',      color: '#e8d5ff' },
  { id: '2', name: 'Engineering', color: '#d5eaff' },
  { id: '3', name: 'Urgent',      color: '#ffd5d5' },
]

type Tab = 'colors' | 'typography' | 'ui'

const tabs: { id: Tab; label: string }[] = [
  { id: 'colors',     label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'ui',         label: 'UI' },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('colors')

  // ChecklistItem demo state
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)

  // TextInput demo state
  const [inputVal, setInputVal] = useState('')

  // TagSelector demo state
  const [tags, setTags] = useState<Tag[]>(DEMO_TAGS)
  const [selectedTags, setSelectedTags] = useState<string[]>(['1'])

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
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {activeTab === 'colors' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Colors</h2>
            <div className={styles.colorGrid}>
              {colors.map((c) => (
                <div key={c.name} className={styles.colorSwatch}>
                  <div
                    className={styles.swatchBlock}
                    style={{
                      background: c.value,
                      outline: c.outline ? '1px solid #dcddd7' : undefined,
                    }}
                  />
                  <p className={styles.swatchName}>{c.name}</p>
                  <p className={styles.swatchValue}>{c.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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
                        <p
                          key={i}
                          className={styles.typeSample}
                          style={{
                            fontSize: t.size,
                            fontWeight: s.weight,
                            fontStyle: s.style,
                            letterSpacing: t.letterSpacing,
                            lineHeight: t.lineHeight,
                          }}
                        >
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

        {activeTab === 'ui' && (
          <>
            {/* ─── Button ──────────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Button</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>primary / md</p>
                  <Button variant="primary">Get started</Button>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>primary / sm</p>
                  <Button variant="primary" size="sm">Get started</Button>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>gray / md</p>
                  <Button variant="gray">Learn more</Button>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>gray / sm</p>
                  <Button variant="gray" size="sm">Learn more</Button>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>disabled</p>
                  <Button variant="primary" disabled>Get started</Button>
                </div>
              </div>
            </section>

            {/* ─── TextInput ───────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>TextInput</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup} style={{ width: 240 }}>
                  <p className={styles.tokenName}>default</p>
                  <TextInput
                    placeholder="e.g. Email address"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                </div>
                <div className={styles.componentGroup} style={{ width: 240 }}>
                  <p className={styles.tokenName}>type="date"</p>
                  <TextInput type="date" />
                </div>
                <div className={styles.componentGroup} style={{ width: 240 }}>
                  <p className={styles.tokenName}>disabled</p>
                  <TextInput placeholder="Not editable" disabled />
                </div>
              </div>
            </section>

            {/* ─── ChecklistItem ───────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>ChecklistItem</h2>
              <div className={styles.componentPreviewBox}>
                <ChecklistItem
                  checked={checked1}
                  onCheckedChange={setChecked1}
                >
                  Create 1:1 docs for all the 1:1s I&rsquo;m doing next week
                </ChecklistItem>
                <ChecklistItem
                  checked={checked2}
                  done={checked2}
                  onCheckedChange={setChecked2}
                >
                  Create a draft plan for manager 1:1 Monday
                </ChecklistItem>
                <ChecklistItem
                  checked={false}
                  trailing={<span style={{ fontSize: '0.75rem', color: 'rgba(12,12,12,0.4)' }}>···</span>}
                >
                  With a trailing actions slot
                </ChecklistItem>
              </div>
            </section>

            {/* ─── Dialog ──────────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dialog</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>sm</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="gray" size="sm">Open sm dialog</Button>
                    </DialogTrigger>
                    <DialogContent width="sm">
                      <DialogHeader title="Small dialog" />
                      <DialogBody>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.5 }}>
                          This is the sm width variant — 400px max. Good for confirmations and short prompts.
                        </p>
                      </DialogBody>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>md</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="gray" size="sm">Open md dialog</Button>
                    </DialogTrigger>
                    <DialogContent width="md">
                      <DialogHeader title="Medium dialog" />
                      <DialogBody>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.5 }}>
                          The md variant — 540px max. Default for most edit panels and detail views.
                        </p>
                      </DialogBody>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>lg</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="gray" size="sm">Open lg dialog</Button>
                    </DialogTrigger>
                    <DialogContent width="lg">
                      <DialogHeader title="Large dialog" />
                      <DialogBody>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.5 }}>
                          The lg variant — 720px max. For complex forms and multi-column layouts.
                        </p>
                      </DialogBody>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            {/* ─── DropdownMenu ────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DropdownMenu</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>default</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="gray" size="sm">Open menu ↓</Button>
                    </DropdownMenuTrigger>
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

            {/* ─── TagSelector ─────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>TagSelector</h2>
              <div className={styles.componentRow}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>inline pills</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {DEMO_TAGS.map((t) => (
                      <TagPill key={t.id} tag={t} />
                    ))}
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
                      const colors = ['#d5ffd5', '#ffe8d5', '#d5f0ff', '#ffd5f0']
                      const newTag: Tag = {
                        id: String(Date.now()),
                        name,
                        color: colors[Math.floor(Math.random() * colors.length)],
                      }
                      setTags((prev) => [...prev, newTag])
                      return newTag
                    }}
                  />
                </div>
              </div>
            </section>

            {/* ─── Footer ──────────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Footer</h2>
              <div className={styles.componentStack}>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>with nav links</p>
                  <div className={styles.componentPreview}>
                    <Footer
                      copyright="© 2026 Subtract"
                      navLinks={[
                        { href: '/writing', label: 'Writing' },
                        { href: '/about',   label: 'About' },
                        { href: 'https://github.com', label: 'GitHub', external: true },
                      ]}
                    />
                  </div>
                </div>
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>copyright only</p>
                  <div className={styles.componentPreview}>
                    <Footer copyright="© 2026 Subtract" />
                  </div>
                </div>
              </div>
            </section>

            {/* ─── Spacing ─────────────────────────────────────────────────── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Spacing</h2>
              <div className={styles.spacingList}>
                {spacing.map((s) => (
                  <div key={s.name} className={styles.spacingRow}>
                    <span className={styles.tokenName}>{s.name}</span>
                    <div className={styles.spacingBar}>
                      <div className={styles.spacingFill} style={{ width: s.value }} />
                    </div>
                    <span className={styles.tokenDetail}>{s.px}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Border Radius ───────────────────────────────────────────── */}
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

            {/* ─── Transitions ─────────────────────────────────────────────── */}
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

      <Footer
        copyright="© 2026 Subtract"
        navLinks={[
          { href: '/writing', label: 'Writing' },
          { href: '/about',   label: 'About' },
          { href: 'https://github.com', label: 'GitHub', external: true },
        ]}
      />
    </>
  )
}
