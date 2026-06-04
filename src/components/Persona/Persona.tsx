import * as React from 'react'
import styles from './Persona.module.scss'

export type PersonaState = 'idle' | 'thinking' | 'listening' | 'speaking'
export type PersonaSize = 'sm' | 'md' | 'lg'

// ─── PersonaAvatar (the Obsidian-inspired orb) ────────────────────────────────

export interface PersonaAvatarProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Activity state — drives the orb's CSS animation. */
  state?: PersonaState
  size?: PersonaSize
  /** Render the animated gradient orb (default). Set false for a flat avatar. */
  orb?: boolean
  /** Fallback content when `orb` is false: initials. */
  initial?: string
  /** Fallback content when `orb` is false: an icon/glyph node. */
  glyph?: React.ReactNode
  /** Fallback content when `orb` is false: an image URL. */
  image?: string
}

export function PersonaAvatar({
  state = 'idle',
  size = 'md',
  orb = true,
  initial,
  glyph,
  image,
  className,
  ...rest
}: PersonaAvatarProps) {
  const cls = [
    styles.avatar,
    styles[`size-${size}`],
    orb ? styles.orb : styles.flat,
    orb ? styles[`state-${state}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (orb) {
    return (
      <span
        className={cls}
        role="img"
        aria-label={`Assistant ${state}`}
        {...rest}
      >
        <span className={styles.orbCore} />
        <span className={styles.orbRing} />
      </span>
    )
  }

  return (
    <span className={cls} {...rest}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className={styles.avatarImage} />
      ) : glyph ? (
        <span className={styles.avatarGlyph}>{glyph}</span>
      ) : (
        <span className={styles.avatarInitial}>{initial}</span>
      )}
    </span>
  )
}

// ─── Persona (avatar + name + role) ───────────────────────────────────────────

export interface PersonaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Display name, e.g. "Athena". */
  name: React.ReactNode
  /** Secondary line, e.g. "Work agent" or a status string. */
  role?: React.ReactNode
  state?: PersonaState
  size?: PersonaSize
  /** Provide a custom avatar; defaults to the animated orb. */
  avatar?: React.ReactNode
  /** Lay out horizontally (default) or stacked/centered. */
  orientation?: 'horizontal' | 'vertical'
}

export function Persona({
  name,
  role,
  state = 'idle',
  size = 'md',
  avatar,
  orientation = 'horizontal',
  className,
  ...rest
}: PersonaProps) {
  return (
    <div
      className={[
        styles.persona,
        styles[`persona-${orientation}`],
        styles[`persona-${size}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {avatar ?? <PersonaAvatar state={state} size={size} />}
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        {role ? <span className={styles.role}>{role}</span> : null}
      </span>
    </div>
  )
}
