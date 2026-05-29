'use client'

import Link from 'next/link'
import * as React from 'react'
import styles from './Sidebar.module.scss'

// ─── Sidebar (root) ───────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Render a permanent sidebar (default), or a collapsible/floating one. */
  variant?: 'inset' | 'floating'
  /** Width in CSS units. Defaults to `$sidebar-width` (18rem). */
  width?: string
  /** When true, removes the right border so it can sit flush against page content. */
  bordered?: boolean
}

export function Sidebar({
  variant = 'inset',
  width,
  bordered = true,
  className,
  style,
  children,
  ...rest
}: SidebarProps) {
  return (
    <aside
      className={[
        styles.sidebar,
        variant === 'floating' ? styles.floating : styles.inset,
        bordered ? styles.bordered : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...(width ? { width } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </aside>
  )
}

// ─── SidebarHeader / SidebarContent / SidebarFooter ───────────────────────────

export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement>

export function SidebarHeader({ className, ...rest }: SidebarSectionProps) {
  return (
    <div
      className={[styles.header, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export function SidebarContent({ className, ...rest }: SidebarSectionProps) {
  return (
    <div
      className={[styles.content, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export function SidebarFooter({ className, ...rest }: SidebarSectionProps) {
  return (
    <div
      className={[styles.footer, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── SidebarGroup / SidebarGroupLabel ─────────────────────────────────────────

export type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement>

export function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return (
    <div
      className={[styles.group, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional right-aligned action (icon button, count, etc.) */
  action?: React.ReactNode
}

export function SidebarGroupLabel({
  className,
  action,
  children,
  ...rest
}: SidebarGroupLabelProps) {
  return (
    <div
      className={[styles.groupLabel, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span>{children}</span>
      {action ? <span className={styles.groupLabelAction}>{action}</span> : null}
    </div>
  )
}

// ─── SidebarSeparator ─────────────────────────────────────────────────────────

export function SidebarSeparator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={[styles.separator, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── SidebarMenu (list wrapper) ───────────────────────────────────────────────

export function SidebarMenu({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={[styles.menu, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── SidebarItem ──────────────────────────────────────────────────────────────

type SidebarItemBase = {
  /** Optional Phosphor icon node (or any React node) rendered on the left. */
  icon?: React.ReactNode
  /**
   * Optional avatar URL OR React node — renders a circular image on the left.
   * If both `icon` and `avatar` are passed, `avatar` wins.
   */
  avatar?: string | React.ReactNode
  /** Primary label text. */
  label: React.ReactNode
  /** Optional secondary text shown beneath the label. */
  description?: React.ReactNode
  /** Right-aligned trailing content: badge, kbd, count, chevron, etc. */
  trailing?: React.ReactNode
  /** Active / current-page state. */
  active?: boolean
  /** Visually subdued (e.g. a disabled item that still routes). */
  disabled?: boolean
  /** Tighter row — useful in dense submenus. */
  size?: 'sm' | 'md'
  /** Indentation level — 0..3. Used for nested menus. */
  indent?: 0 | 1 | 2 | 3
  className?: string
}

export type SidebarItemProps =
  | (SidebarItemBase & {
      href: string
      external?: boolean
      onClick?: never
      as?: never
    })
  | (SidebarItemBase & {
      href?: undefined
      external?: never
      onClick?: React.MouseEventHandler<HTMLButtonElement>
      as?: 'button'
    })

function renderLeading(
  icon: React.ReactNode | undefined,
  avatar: string | React.ReactNode | undefined
) {
  if (avatar) {
    if (typeof avatar === 'string') {
      return (
        <span className={styles.leadingAvatar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="" />
        </span>
      )
    }
    return <span className={styles.leadingAvatar}>{avatar}</span>
  }
  if (icon) {
    return <span className={styles.leadingIcon}>{icon}</span>
  }
  return null
}

export function SidebarItem(props: SidebarItemProps) {
  const {
    icon,
    avatar,
    label,
    description,
    trailing,
    active = false,
    disabled = false,
    size = 'md',
    indent = 0,
    className,
  } = props

  const rowClass = [
    styles.item,
    size === 'sm' ? styles.itemSm : null,
    active ? styles.active : null,
    disabled ? styles.disabled : null,
    indent ? styles[`indent${indent}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {renderLeading(icon, avatar)}
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description ? (
          <span className={styles.description}>{description}</span>
        ) : null}
      </span>
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </>
  )

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <li className={styles.itemWrap}>
          <a
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
            aria-current={active ? 'page' : undefined}
            aria-disabled={disabled || undefined}
          >
            {inner}
          </a>
        </li>
      )
    }
    return (
      <li className={styles.itemWrap}>
        <Link
          href={props.href}
          className={rowClass}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
        >
          {inner}
        </Link>
      </li>
    )
  }

  return (
    <li className={styles.itemWrap}>
      <button
        type="button"
        className={rowClass}
        onClick={props.onClick}
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
      >
        {inner}
      </button>
    </li>
  )
}
