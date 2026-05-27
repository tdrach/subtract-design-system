'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ArrowUp, ArrowDown, ArrowsDownUp, DotsThree } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../DropdownMenu'
import styles from './DataTable.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc'

export interface ColumnDef<TData> {
  id: string
  /** Column header label. */
  header: string
  /**
   * Key on the data object used to read the cell value and to sort.
   * When omitted, the column is display-only (cell renderer required).
   */
  accessorKey?: keyof TData
  /**
   * Custom cell renderer. Receives the raw value (typed as `unknown`) and
   * the full row object. When provided alongside an `accessorKey` the value
   * is the accessed field; otherwise it is `undefined`.
   */
  cell?: (value: unknown, row: TData) => React.ReactNode
  /**
   * Whether the column supports sorting. Defaults to `true` when
   * `accessorKey` is set, `false` otherwise. Set explicitly to `false`
   * to disable sorting on a column that has an `accessorKey` (e.g. arrays).
   */
  sortable?: boolean
  /** Fixed column width as a pixel number or any CSS width string. */
  width?: number | string
  /** Cell + header alignment. Defaults to `'left'`. */
  align?: 'left' | 'center' | 'right'
}

export type RowAction<TData> =
  | { separator?: false; label: string; onSelect: (row: TData) => void; destructive?: boolean }
  | { separator: true }

export interface DataTableProps<TData extends object> {
  /** Column definitions. */
  columns: ColumnDef<TData>[]
  /** Row data. */
  data: TData[]
  /** Returns a stable unique string ID for each row. Defaults to row index. */
  getRowId?: (row: TData, index: number) => string
  /**
   * Per-row actions rendered in a ⋯ overflow menu.
   * Pass an array for uniform actions, or a function to vary actions per row.
   */
  rowActions?: RowAction<TData>[] | ((row: TData) => RowAction<TData>[])
  /** Enable row-selection checkboxes. */
  selectable?: boolean
  /** Called whenever the selection set changes. Receives the current selected row IDs. */
  onSelectionChange?: (ids: string[]) => void
  /** Column ID to sort by on initial render. */
  defaultSortId?: string
  /** Initial sort direction. Defaults to `'asc'`. */
  defaultSortDirection?: SortDirection
  /** Text shown when `data` is empty. */
  emptyMessage?: string
}

// ─── Internal checkbox (handles indeterminate state via ref) ──────────────────

interface TableCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  'aria-label'?: string
}

function TableCheckbox({ checked, indeterminate, onChange, 'aria-label': ariaLabel }: TableCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={styles.checkbox}
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      aria-label={ariaLabel}
    />
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DataTable<TData extends object>({
  columns,
  data,
  getRowId,
  rowActions,
  selectable = false,
  onSelectionChange,
  defaultSortId,
  defaultSortDirection = 'asc',
  emptyMessage = 'No results.',
}: DataTableProps<TData>) {

  // ── Sort ────────────────────────────────────────────────────────────────
  const [sort, setSort] = useState<{ id: string; direction: SortDirection } | null>(
    defaultSortId ? { id: defaultSortId, direction: defaultSortDirection } : null
  )

  // ── Selection ───────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const rowIdFn = useCallback(
    (row: TData, index: number) => (getRowId ? getRowId(row, index) : String(index)),
    [getRowId]
  )

  // ── Sorted data ─────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sort) return data
    const col = columns.find(c => c.id === sort.id)
    if (!col?.accessorKey) return data

    return [...data].sort((a, b) => {
      const va = a[col.accessorKey!]
      const vb = b[col.accessorKey!]
      let cmp = 0
      if (typeof va === 'number' && typeof vb === 'number') {
        cmp = va - vb
      } else {
        cmp = String(va ?? '').localeCompare(String(vb ?? ''))
      }
      return sort.direction === 'desc' ? -cmp : cmp
    })
  }, [data, sort, columns])

  // ── Selection helpers ───────────────────────────────────────────────────
  const allRowIds = useMemo(
    () => sortedData.map((row, i) => rowIdFn(row, i)),
    [sortedData, rowIdFn]
  )
  const allSelected  = allRowIds.length > 0 && allRowIds.every(id => selectedIds.has(id))
  const someSelected = !allSelected && allRowIds.some(id => selectedIds.has(id))

  function toggleAll(checked: boolean) {
    const next = checked ? new Set(allRowIds) : new Set<string>()
    setSelectedIds(next)
    onSelectionChange?.(checked ? allRowIds : [])
  }

  function toggleRow(id: string, checked: boolean) {
    const next = new Set(selectedIds)
    if (checked) next.add(id); else next.delete(id)
    setSelectedIds(next)
    onSelectionChange?.([...next])
  }

  // ── Sort handler (cycles: none → asc → desc → none) ─────────────────────
  function handleSort(colId: string) {
    setSort(prev => {
      if (!prev || prev.id !== colId) return { id: colId, direction: 'asc' }
      if (prev.direction === 'asc')   return { id: colId, direction: 'desc' }
      return null
    })
  }

  const hasActions = Boolean(rowActions)
  const colSpan    = (selectable ? 1 : 0) + columns.length + (hasActions ? 1 : 0)

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <colgroup>
          {selectable && <col style={{ width: 44 }} />}
          {columns.map(col => (
            <col
              key={col.id}
              style={col.width !== undefined
                ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
                : undefined}
            />
          ))}
          {hasActions && <col style={{ width: 48 }} />}
        </colgroup>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <thead className={styles.thead}>
          <tr>
            {selectable && (
              <th className={`${styles.th} ${styles.checkboxCol}`}>
                <TableCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}

            {columns.map(col => {
              const isSortable = col.sortable !== false && Boolean(col.accessorKey)
              const isSorted   = sort?.id === col.id

              return (
                <th
                  key={col.id}
                  className={[
                    styles.th,
                    isSortable ? styles.sortable : '',
                    isSorted   ? styles.sorted   : '',
                    col.align === 'right'  ? styles.alignRight  : '',
                    col.align === 'center' ? styles.alignCenter : '',
                  ].filter(Boolean).join(' ')}
                  onClick={isSortable ? () => handleSort(col.id) : undefined}
                >
                  <span className={styles.thInner}>
                    {col.header}
                    {isSortable && (
                      <span className={styles.sortIcon}>
                        {isSorted && sort?.direction === 'asc'  ? <ArrowUp size={11} weight="bold" /> :
                         isSorted && sort?.direction === 'desc' ? <ArrowDown size={11} weight="bold" /> :
                         <ArrowsDownUp size={11} weight="bold" />}
                      </span>
                    )}
                  </span>
                </th>
              )
            })}

            {hasActions && <th className={`${styles.th} ${styles.actionsCol}`} />}
          </tr>
        </thead>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td className={styles.emptyCell} colSpan={colSpan}>{emptyMessage}</td>
            </tr>
          ) : (
            sortedData.map((row, i) => {
              const rowId     = rowIdFn(row, i)
              const isSelected = selectedIds.has(rowId)
              const actions   = rowActions
                ? (typeof rowActions === 'function' ? rowActions(row) : rowActions)
                : null

              return (
                <tr
                  key={rowId}
                  className={[styles.tr, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
                >
                  {selectable && (
                    <td className={`${styles.td} ${styles.checkboxCol}`}>
                      <TableCheckbox
                        checked={isSelected}
                        onChange={checked => toggleRow(rowId, checked)}
                        aria-label={`Select row ${i + 1}`}
                      />
                    </td>
                  )}

                  {columns.map(col => {
                    const rawValue = col.accessorKey !== undefined ? row[col.accessorKey] : undefined
                    const content  = col.cell
                      ? col.cell(rawValue, row)
                      : rawValue !== null && rawValue !== undefined
                        ? String(rawValue)
                        : null

                    return (
                      <td
                        key={col.id}
                        className={[
                          styles.td,
                          col.align === 'right'  ? styles.alignRight  : '',
                          col.align === 'center' ? styles.alignCenter : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {content}
                      </td>
                    )
                  })}

                  {hasActions && actions && (
                    <td className={`${styles.td} ${styles.actionsCol}`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={styles.actionsButton} aria-label="Row actions">
                            <DotsThree size={16} weight="bold" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions.map((action, ai) => {
                            if (action.separator) {
                              return <DropdownMenuSeparator key={`sep-${ai}`} />
                            }
                            return (
                              <DropdownMenuItem
                                key={action.label}
                                destructive={action.destructive}
                                onSelect={() => action.onSelect(row)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
