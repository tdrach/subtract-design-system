'use client'

import { useState } from 'react'
import { Button, NumberInput, Select, TextInput, Textarea } from '@subtract/ds'
import { Plus, ArrowsClockwise } from '@phosphor-icons/react'
import styles from './page.module.scss'

// ─── Labelled dense field (mirrors gridfinity's Inspector Field) ───────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.denseField}>
      <span className={styles.denseFieldLabel}>{label}</span>
      {children}
    </label>
  )
}

// ─── Dense showcase ─────────────────────────────────────────────────────────────

export function DenseShowcase() {
  // Standalone control demos
  const [denseText, setDenseText] = useState('')
  const [numVal, setNumVal] = useState(12)
  const [selVal, setSelVal] = useState('extrude')
  const [areaVal, setAreaVal] = useState('')

  // Inline-label fields (Flatland inspector row)
  const [box, setBox] = useState({ w: 42, h: 21, a: 12 })

  // Inspector panel demo
  const [dims, setDims] = useState({ w: 42, h: 21, d: 7, r: 2 })
  const [op, setOp] = useState('union')
  const [name, setName] = useState('Bin 2×1')
  const [notes, setNotes] = useState('')

  // Gridfinity properties-panel use case
  const [printer, setPrinter] = useState('p1s')
  const [plate, setPlate] = useState({ w: 256, d: 256, h: 250 })

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Dense system (size=&quot;sm&quot;)</h2>
        <p className={styles.chartIntro}>
          Compact 28px / <code>$text-small</code> tool controls for inspectors,
          toolbars, and property panels — built for the Gridfinity studio.
          Dense controls render in <code>$font-dense</code>, the platform&apos;s
          system UI stack (<strong>SF Pro</strong> on macOS, Segoe UI on
          Windows), while <code>md</code> controls keep Indivisible as the
          brand voice. <code>NumberInput</code> supports ↑/↓ stepping
          (Shift&nbsp;×10), a unit suffix, and commit-on-blur/Enter.
        </p>

        <div className={styles.componentRow}>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>TextInput — sm</p>
            <div style={{ width: 200 }}>
              <TextInput size="sm" placeholder="Name" value={denseText} onChange={(e) => setDenseText(e.target.value)} />
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>NumberInput — sm, suffix, step</p>
            <div style={{ width: 120 }}>
              <NumberInput size="sm" suffix="mm" step={1} value={numVal} onChange={setNumVal} aria-label="Size" />
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>Select — sm</p>
            <div style={{ width: 160 }}>
              <Select size="sm" value={selVal} onChange={(e) => setSelVal(e.target.value)}>
                <option value="extrude">Extrude</option>
                <option value="revolve">Revolve</option>
              </Select>
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>Textarea — sm</p>
            <div style={{ width: 200 }}>
              <Textarea size="sm" rows={2} placeholder="Notes…" value={areaVal} onChange={(e) => setAreaVal(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Dense buttons</h2>
        <p className={styles.chartIntro}>
          <code>Button size=&quot;dense&quot;</code> — 28px, <code>$font-dense</code>{' '}
          (SF Pro), <code>$radius-micro</code>, 1px border — matches the dense
          field metrics exactly, so inputs and buttons line up edge-to-edge in
          an inspector or toolbar row.
        </p>
        <div className={styles.componentRow}>
          <div className={styles.componentGroup}><p className={styles.tokenName}>primary</p><Button size="dense" variant="primary">Apply</Button></div>
          <div className={styles.componentGroup}><p className={styles.tokenName}>secondary</p><Button size="dense" variant="secondary">Reset</Button></div>
          <div className={styles.componentGroup}><p className={styles.tokenName}>gray</p><Button size="dense" variant="gray">Cancel</Button></div>
          <div className={styles.componentGroup}><p className={styles.tokenName}>iconBefore</p><Button size="dense" variant="secondary" iconBefore={<Plus size={13} weight="bold" />}>Add</Button></div>
          <div className={styles.componentGroup}><p className={styles.tokenName}>iconOnly</p><Button size="dense" variant="secondary" iconOnly aria-label="Refresh"><ArrowsClockwise size={13} weight="bold" /></Button></div>
          <div className={styles.componentGroup}><p className={styles.tokenName}>disabled</p><Button size="dense" variant="primary" disabled>Apply</Button></div>
        </div>

        <p className={styles.tokenName} style={{ marginTop: 24 }}>paired toolbar row (dense fields + buttons)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ width: 90 }}><NumberInput size="sm" label="W" suffix="mm" value={box.w} onChange={(w) => setBox((b) => ({ ...b, w }))} aria-label="Width toolbar" /></div>
          <div style={{ width: 90 }}><NumberInput size="sm" label="H" suffix="mm" value={box.h} onChange={(h) => setBox((b) => ({ ...b, h }))} aria-label="Height toolbar" /></div>
          <div style={{ width: 120 }}>
            <Select size="sm" value={op} onChange={(e) => setOp(e.target.value)}>
              <option value="union">Union</option>
              <option value="subtract">Subtract</option>
            </Select>
          </div>
          <Button size="dense" variant="secondary" iconBefore={<Plus size={13} weight="bold" />}>Add</Button>
          <Button size="dense" variant="primary">Apply</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Properties panel — Gridfinity</h2>
        <p className={styles.chartIntro}>
          The real use case: Gridfinity&apos;s build-plate properties panel, where
          a <code>Select</code>, <code>NumberInput</code>s, and{' '}
          <code>Button</code>s all share the dense metrics — 28px tall,{' '}
          <code>$radius-micro</code>, <code>$font-dense</code> — so the dropdown,
          the dimension fields, and the actions read as one family.
        </p>

        <div className={styles.densePanel} style={{ width: 300 }}>
          <p className={styles.densePanelTitle}>Build plate</p>
          <Select size="sm" value={printer} onChange={(e) => setPrinter(e.target.value)} aria-label="Printer">
            <option value="p1s">Bambu Lab P1S</option>
            <option value="p2s">Bambu Lab P2S</option>
            <option value="x1c">Bambu Lab X1C</option>
          </Select>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}><NumberInput size="sm" label="W" suffix="mm" value={plate.w} onChange={(w) => setPlate((p) => ({ ...p, w }))} aria-label="Width" /></div>
            <div style={{ flex: 1, minWidth: 0 }}><NumberInput size="sm" label="D" suffix="mm" value={plate.d} onChange={(d) => setPlate((p) => ({ ...p, d }))} aria-label="Depth" /></div>
          </div>
          <NumberInput size="sm" label="Max height" suffix="mm" value={plate.h} onChange={(h) => setPlate((p) => ({ ...p, h }))} aria-label="Max height" />

          <div className={styles.denseDivider} />

          <Button size="dense" variant="primary" iconBefore={<Plus size={13} weight="bold" />}>Add plate</Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="dense" variant="secondary" style={{ flex: 1 }}>Set as my default</Button>
            <Button size="dense" variant="gray" style={{ flex: 1 }}>Duplicate plate</Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inline-label fields</h2>
        <p className={styles.chartIntro}>
          <code>NumberInput</code> takes a <code>label</code> prop — a muted
          prefix rendered <em>inside</em> the field, before the value. It
          collapses a labelled dimension (<code>W</code> · value · <code>mm</code>)
          into one dense control (Figma: the Flatland inspector), instead of a
          separate label beside the input. The whole field is one hit target —
          clicking the label or unit focuses the value.
        </p>
        <div className={styles.componentRow}>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>label + suffix — sm</p>
            <div style={{ width: 90 }}>
              <NumberInput size="sm" label="W" suffix="mm" value={box.w} onChange={(w) => setBox((b) => ({ ...b, w }))} aria-label="Width" />
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>row of fields</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 90 }}><NumberInput size="sm" label="W" suffix="mm" value={box.w} onChange={(w) => setBox((b) => ({ ...b, w }))} aria-label="Width" /></div>
              <div style={{ width: 90 }}><NumberInput size="sm" label="H" suffix="mm" value={box.h} onChange={(h) => setBox((b) => ({ ...b, h }))} aria-label="Height" /></div>
              <div style={{ width: 80 }}><NumberInput size="sm" label="∠" suffix="°" value={box.a} onChange={(a) => setBox((b) => ({ ...b, a }))} aria-label="Angle" /></div>
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>label only (no unit)</p>
            <div style={{ width: 90 }}>
              <NumberInput size="sm" label="X" value={box.w} onChange={(w) => setBox((b) => ({ ...b, w }))} aria-label="X position" />
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>md</p>
            <div style={{ width: 140 }}>
              <NumberInput label="W" suffix="mm" value={box.w} onChange={(w) => setBox((b) => ({ ...b, w }))} aria-label="Width md" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Font pairing — md vs sm</h2>
        <p className={styles.chartIntro}>
          The same control at both densities: <code>md</code> is Indivisible
          (<code>$font-text</code>), <code>sm</code> is the system font
          (<code>$font-dense</code>) for crisper rendering at 12.8px.
        </p>
        <div className={styles.componentRow}>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>md — Indivisible</p>
            <div style={{ width: 240 }}>
              <TextInput placeholder="The quick brown fox" defaultValue="The quick brown fox" aria-label="md sample" />
            </div>
          </div>
          <div className={styles.componentGroup}>
            <p className={styles.tokenName}>sm — system (SF Pro on Mac)</p>
            <div style={{ width: 240 }}>
              <TextInput size="sm" placeholder="The quick brown fox" defaultValue="The quick brown fox" aria-label="sm sample" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inspector panel</h2>
        <p className={styles.chartIntro}>
          The controls composed the way the Gridfinity studio uses them — a
          labelled property panel. Labels and values all sit on the dense
          system font.
        </p>

        <div className={styles.densePanel}>
          <p className={styles.densePanelTitle}>Dimensions</p>
          <div className={styles.denseGrid}>
            <Field label="W"><NumberInput size="sm" suffix="mm" value={dims.w} onChange={(w) => setDims((d) => ({ ...d, w }))} aria-label="Width" /></Field>
            <Field label="H"><NumberInput size="sm" suffix="mm" value={dims.h} onChange={(h) => setDims((d) => ({ ...d, h }))} aria-label="Height" /></Field>
            <Field label="D"><NumberInput size="sm" suffix="mm" value={dims.d} onChange={(dv) => setDims((d) => ({ ...d, d: dv }))} aria-label="Depth" /></Field>
            <Field label="R"><NumberInput size="sm" suffix="mm" step={0.5} value={dims.r} onChange={(r) => setDims((d) => ({ ...d, r }))} aria-label="Corner radius" /></Field>
          </div>

          <div className={styles.denseDivider} />

          <p className={styles.densePanelTitle}>Boolean</p>
          <Field label="Op">
            <Select size="sm" value={op} onChange={(e) => setOp(e.target.value)}>
              <option value="union">Union</option>
              <option value="subtract">Subtract</option>
              <option value="intersect">Intersect</option>
            </Select>
          </Field>

          <div className={styles.denseDivider} />

          <p className={styles.densePanelTitle}>Meta</p>
          <Field label="Name">
            <TextInput size="sm" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Notes">
            <Textarea size="sm" rows={2} placeholder="Print settings, tolerances…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
      </section>
    </>
  )
}
