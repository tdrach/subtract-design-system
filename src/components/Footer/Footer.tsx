import Link from 'next/link'
import styles from './Footer.module.scss'
import type { NavLink } from '../Header'

export interface FooterProps {
  copyright?: string
  navLinks?: NavLink[]
}

export default function Footer({
  copyright,
  navLinks = [],
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          {copyright ?? `© ${year}`}
        </span>
        {navLinks.length > 0 && (
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
          </nav>
        )}
      </div>
    </footer>
  )
}
