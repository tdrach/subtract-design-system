import Link from 'next/link'
import styles from './Header.module.scss'

export interface NavLink {
  href: string
  label: string
  external?: boolean
}

export interface HeaderProps {
  wordmark?: string
  wordmarkHref?: string
  navLinks?: NavLink[]
  rightSlot?: React.ReactNode
}

export default function Header({
  wordmark = 'Brand',
  wordmarkHref = '/',
  navLinks = [],
  rightSlot,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={wordmarkHref} className={styles.wordmark}>
          {wordmark}
        </Link>
        <nav className={styles.nav}>
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            )
          )}
          {rightSlot && (
            <span className={styles.rightSlot}>{rightSlot}</span>
          )}
        </nav>
      </div>
    </header>
  )
}
