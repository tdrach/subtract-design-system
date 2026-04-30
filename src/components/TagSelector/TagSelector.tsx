'use client'

import { useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import styles from './TagSelector.module.scss'

export interface Tag {
  id: string
  name: string
  color: string
}

interface Props {
  tags: Tag[]
  selected: string[]
  onSelect: (tagId: string) => void
  onDeselect: (tagId: string) => void
  onCreate: (name: string) => Promise<Tag>
  /** Compact mode: inline width, placeholder hidden until hover */
  compact?: boolean
}

const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
]

export function TagSelector({ tags, selected, onSelect, onDeselect, onCreate, compact }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )
  const exactMatch = tags.some((t) => t.name.toLowerCase() === query.toLowerCase())
  const showCreate = query.length > 0 && !exactMatch

  async function handleCreate() {
    if (!query.trim() || creating) return
    setCreating(true)
    const tag = await onCreate(query.trim())
    onSelect(tag.id)
    setQuery('')
    setCreating(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && showCreate) {
      e.preventDefault()
      handleCreate()
    }
    if (e.key === 'Escape') setOpen(false)
  }

  const selectedTags = tags.filter((t) => selected.includes(t.id))

  const triggerClass = [styles.trigger, compact ? styles.compact : ''].filter(Boolean).join(' ')

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className={triggerClass} role="button" tabIndex={0}>
          {selectedTags.length === 0 ? (
            <span className={styles.placeholder}>Add tags…</span>
          ) : (
            <div className={styles.pills}>
              {selectedTags.map((t) => (
                <TagPill key={t.id} tag={t} />
              ))}
              <span className={styles.addMore}>+</span>
            </div>
          )}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.content} align="start" sideOffset={4}>
          <input
            ref={inputRef}
            className={styles.search}
            placeholder="Search or create…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <div className={styles.list}>
            {filtered.map((tag) => {
              const isSelected = selected.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                  onClick={() => isSelected ? onDeselect(tag.id) : onSelect(tag.id)}
                >
                  <span className={styles.dot} style={{ background: tag.color }} />
                  <span className={styles.optionName}>{tag.name}</span>
                  {isSelected && <span className={styles.check}>✓</span>}
                </button>
              )
            })}

            {showCreate && (
              <button
                className={`${styles.option} ${styles.createOption}`}
                onClick={handleCreate}
                disabled={creating}
              >
                <span className={styles.dot} style={{ background: TAG_COLORS[tags.length % TAG_COLORS.length] }} />
                <span className={styles.optionName}>
                  Create <strong>&ldquo;{query}&rdquo;</strong>
                </span>
              </button>
            )}

            {filtered.length === 0 && !showCreate && (
              <p className={styles.empty}>No tags yet</p>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function TagPill({ tag }: { tag: Tag }) {
  return (
    <span className={styles.pill} style={{ background: `${tag.color}1f`, color: tag.color }}>
      {tag.name}
    </span>
  )
}
