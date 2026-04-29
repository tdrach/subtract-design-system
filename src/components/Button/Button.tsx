import Link from 'next/link'
import styles from './Button.module.scss'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'gray'
  size?: 'sm' | 'md'
  href?: string
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  onDropdownClick?: () => void
  split?: boolean
  className?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  disabled,
  type = 'button',
  onClick,
  onDropdownClick,
  split = false,
  className: extraClass,
  children,
}: ButtonProps) {
  const baseClass = [
    styles.button,
    styles[variant],
    styles[size],
    extraClass,
  ].filter(Boolean).join(' ')

  // ─── Split button ────────────────────────────────────────────────────────
  if (split) {
    return (
      <div className={[styles.splitGroup, styles[variant], styles[size]].filter(Boolean).join(' ')}>
        <button
          type={type}
          className={styles.splitMain}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
        <button
          type="button"
          className={styles.splitChevron}
          disabled={disabled}
          onClick={onDropdownClick}
          aria-label="More options"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  // ─── Link button ─────────────────────────────────────────────────────────
  if (href) {
    return external ? (
      <a href={href} className={baseClass} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <Link href={href} className={baseClass}>{children}</Link>
    )
  }

  return (
    <button type={type} className={baseClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
