import { BubbleMatrix } from '@subtract/ds'
import type {
  BubbleMatrixCell,
  BubbleMatrixCol,
  BubbleMatrixRow,
  CalendarDataPoint,
} from '@subtract/ds'

// ─── Machine × weekday load — print hours per machine ────────────────────────

const MACHINE_ROWS: BubbleMatrixRow[] = [
  { id: 'mk4',   label: 'Prusa MK4'  },
  { id: 'x1c',   label: 'Bambu X1C'  },
  { id: 'voron', label: 'Voron 2.4'  },
  { id: 'form4', label: 'Form 4'     },
  { id: 'shape', label: 'Shapeoko 5' },
]

const WEEKDAY_COLS: BubbleMatrixCol[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
]

const MACHINE_LOAD: BubbleMatrixCell[] = [
  { rowId: 'mk4',   colId: 'mon', value: 42  },
  { rowId: 'mk4',   colId: 'tue', value: 80  },
  { rowId: 'mk4',   colId: 'wed', value: 35  },
  { rowId: 'mk4',   colId: 'thu', value: 65  },
  { rowId: 'mk4',   colId: 'fri', value: 90  },
  { rowId: 'x1c',   colId: 'mon', value: 120 },
  { rowId: 'x1c',   colId: 'tue', value: 95  },
  { rowId: 'x1c',   colId: 'wed', value: 140 },
  { rowId: 'x1c',   colId: 'thu', value: 110 },
  { rowId: 'x1c',   colId: 'fri', value: 70  },
  { rowId: 'voron', colId: 'mon', value: 55  },
  { rowId: 'voron', colId: 'tue', value: 30  },
  { rowId: 'voron', colId: 'wed', value: 75  },
  { rowId: 'voron', colId: 'thu', value: 90  },
  { rowId: 'voron', colId: 'fri', value: 45  },
  { rowId: 'form4', colId: 'mon', value: 20  },
  { rowId: 'form4', colId: 'tue', value: 60  },
  { rowId: 'form4', colId: 'wed', value: 50  },
  { rowId: 'form4', colId: 'thu', value: 30  },
  { rowId: 'form4', colId: 'fri', value: 100 },
  { rowId: 'shape', colId: 'mon', value: 85  },
  { rowId: 'shape', colId: 'tue', value: 45  },
  { rowId: 'shape', colId: 'wed', value: 60  },
  { rowId: 'shape', colId: 'thu', value: 140 },
  { rowId: 'shape', colId: 'fri', value: 35  },
]

// ─── Calendar mode — April 2026 parts completed per day ──────────────────────
// Distribution is tuned so all four discrete bubble sizes (r5/9/15/24) appear.
// Peak is Apr 15 (1 200); thresholds ≥900 → r24, ≥600 → r15, ≥300 → r9, >0 → r5.

const SHOP_DAYS: CalendarDataPoint[] = [
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

const APRIL_2026 = new Date(2026, 3)

// ─── Stories ─────────────────────────────────────────────────────────────────

export function MachineLoad() {
  return (
    <BubbleMatrix
      rows={MACHINE_ROWS}
      cols={WEEKDAY_COLS}
      data={MACHINE_LOAD}
      width={420}
      labelWidth={110}
      valueFormat={(v) => `${v} h`}
      uid="bm-load"
    />
  )
}

export function MatrixBare() {
  return (
    <BubbleMatrix
      rows={MACHINE_ROWS}
      cols={WEEKDAY_COLS}
      data={MACHINE_LOAD}
      color="#06D021"
      width={280}
      labelWidth={0}
      showLabels={false}
      showHeaders={false}
      uid="bm-bare"
    />
  )
}

export function CalendarMonth() {
  return (
    <BubbleMatrix
      calendarData={SHOP_DAYS}
      month={APRIL_2026}
      width={360}
      valueFormat={(v) => `${v.toLocaleString()} parts`}
      uid="bm-cal"
    />
  )
}

export function CalendarWide() {
  return (
    <BubbleMatrix
      calendarData={SHOP_DAYS}
      month={APRIL_2026}
      color="#06D021"
      width={480}
      valueFormat={(v) => `${v.toLocaleString()} parts`}
      uid="bm-cal-wide"
    />
  )
}

export function CalendarCompact() {
  return (
    <div
      style={{
        width: 320,
        padding: 16,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12.8, fontWeight: 500, color: 'var(--ink-dark)' }}>April 2026</span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>17,940 parts</span>
      </div>
      <BubbleMatrix
        calendarData={SHOP_DAYS}
        month={APRIL_2026}
        width={288}
        compact
        color="#7c3aed"
        uid="bm-cal-compact"
      />
    </div>
  )
}
