import { Footer } from '@subtract/ds'

export function SiteFooter() {
  return (
    <Footer
      copyright="© 2026 Subtract"
      navLinks={[
        { href: '/writing', label: 'Writing' },
        { href: '/about', label: 'About' },
        { href: 'https://github.com', label: 'GitHub', external: true },
      ]}
    />
  )
}

export function ProductFooter() {
  return (
    <Footer
      copyright="© 2026 Subtract — build plates, bins & fixtures"
      navLinks={[
        { href: '/docs', label: 'Docs' },
        { href: '/changelog', label: 'Changelog' },
        { href: '/status', label: 'Status' },
        { href: '/privacy', label: 'Privacy' },
        { href: '/terms', label: 'Terms' },
      ]}
    />
  )
}

export function CopyrightOnly() {
  return <Footer copyright="© 2026 Subtract" />
}
