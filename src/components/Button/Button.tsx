import Link from 'next/link'
import styles from './Button.module.scss'

export interface ButtonProps {
  variant?: 'primary' | 'gray'
  size?: 'sm' | 'md'
  href?: string
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
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
  className: extraClass,
  children,
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    extraClass,
  ].filter(Boolean).join(' ')

  if (href) {
    return external ? (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
