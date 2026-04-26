'use client'

import { useState } from 'react'
import { Button, Footer } from '@subtract/ds'
import styles from './page.module.scss'

const colors = [
  { name: '$black',       value: '#0c0c0c',                       dark: true  },
  { name: '$light',       value: '#f3f3f3',                       dark: false },
  { name: '$white',       value: '#ffffff',                       dark: false },
  { name: '$demure',      value: '#dcddd7',                       dark: false },
  { name: '$blue',        value: '#0035ff',                       dark: true  },
  { name: '$error',       value: '#c13535',                       dark: true  },
  { name: '$ink-dark',    value: '#0c0c0c',                       dark: true  },
  { name: '$ink-light',   value: '#ffffff',                       dark: false, outline: true },
  { name: '$muted-dark',  value: 'rgba(12, 12, 12, 0.48)',        dark: true  },
  { name: '$muted-light', value: 'rgba(255, 255, 255, 0.7)',      dark: false, outline: true },
]

const typeScale = [
  { name: '$text-4xl',    size: '9rem',      label: '144px — hero title',   letterSpacing: '-0.07em' },
  { name: '$text-3xl',    size: '3.5rem',    label: '56px — large display'  },
  { name: '$text-2xl',    size: '2.625rem',  label: '42px — section heading' },
  { name: '$text-xl',     size: '1.75rem',   label: '28px — SneakPeak body' },
  { name: '$text-lg',     size: '1.5rem',    label: '24px — inbetween'      },
  { name: '$text-normal', size: '1.2rem',    label: '19.2px — body'         },
  { name: '$text-base',   size: '1.0625rem', label: '17px — base'           },
  { name: '$text-xs',     size: '0.875rem',  label: '14px'                  },
  { name: '$text-small',  size: '0.8rem',    label: '12.8px — captions'     },
  { name: '$text-micro',  size: '0.75rem',   label: '12px'                  },
  { name: '$text-nano',   size: '0.625rem',  label: '10px'                  },
]

const fontWeights = [
  { name: 'Regular',        weight: 400, style: 'normal' },
  { name: 'Medium',         weight: 500, style: 'normal' },
  { name: 'Bold',           weight: 700, style: 'normal' },
  { name: 'Regular Italic', weight: 400, style: 'italic' },
  { name: 'Bold Italic',    weight: 700, style: 'italic' },
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
  { name: '$radius-micro', value: '5px'  },
  { name: '$radius-sm',    value: '8px'  },
  { name: '$radius-md',    value: '11px' },
  { name: '$radius-lg',    value: '12px' },
  { name: '$radius-pill',  value: '980px' },
  { name: '$radius-circle',value: '50%'  },
]

const transitions = [
  { name: '$t-fast',          value: '220ms ease (curve-1)' },
  { name: '$t-medium',        value: '320ms ease (curve-1)' },
  { name: '$transition-fast', value: '120ms ease' },
  { name: '$transition-base', value: '200ms ease' },
  { name: '$transition-slow', value: '320ms ease' },
]

type Tab = 'colors' | 'typography' | 'ui'

const tabs: { id: Tab; label: string }[] = [
  { id: 'colors',     label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'ui',         label: 'UI' },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('colors')

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
                  The system uses a single typeface — <strong>Indivisible</strong> by Connary
                  Fagen — for both display and body copy. It&rsquo;s bundled as a local font
                  in the preview app via <code>next/font/local</code>, loaded from{' '}
                  <code>public/fonts/</code>, and exposed through the CSS variable{' '}
                  <code>--font-indivisible</code>. Both <code>$font-display</code> and{' '}
                  <code>$font-text</code> tokens resolve to it.
                </p>
                <div className={styles.weightList}>
                  {fontWeights.map((w) => (
                    <div key={w.name} className={styles.weightRow}>
                      <span className={styles.weightMeta}>
                        {w.name}
                        <span className={styles.weightNumeric}>
                          {' '}· {w.weight}
                          {w.style === 'italic' ? ' italic' : ''}
                        </span>
                      </span>
                      <span
                        className={styles.weightSample}
                        style={{ fontWeight: w.weight, fontStyle: w.style }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Type Scale</h2>
              <div className={styles.typeList}>
                {typeScale.map((t) => (
                  <div key={t.name} className={styles.typeRow}>
                    <div className={styles.typeMeta}>
                      <span className={styles.tokenName}>{t.name}</span>
                      <span className={styles.tokenDetail}>{t.label}</span>
                    </div>
                    <p
                      className={styles.typeSample}
                      style={{
                        fontSize: t.size,
                        letterSpacing: t.letterSpacing ?? '-0.025rem',
                        lineHeight: parseFloat(t.size) > 2 ? '0.9' : '1.4',
                      }}
                    >
                      Subtract
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'ui' && (
          <>
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
                <div className={styles.componentGroup}>
                  <p className={styles.tokenName}>default (no props)</p>
                  <div className={styles.componentPreview}>
                    <Footer />
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
                    <div className={styles.spacingBar}>
                      <div
                        className={styles.spacingFill}
                        style={{ width: s.value }}
                      />
                    </div>
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
                    <div
                      className={styles.radiusBlock}
                      style={{ borderRadius: r.value }}
                    />
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
