import { Header, Button } from '@subtract/ds'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'

const FRAME: React.CSSProperties = {
  border: '1px solid var(--demure)',
  borderRadius: 12,
  overflow: 'hidden',
  background: 'var(--light)',
}

const STAGE: React.CSSProperties = {
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--ink-light)',
  fontSize: 13,
}

export function AppNav() {
  return (
    <div style={FRAME}>
      <Header
        wordmark="Subtract"
        wordmarkHref="/"
        navLinks={[
          { href: '/projects', label: 'Projects' },
          { href: '/library', label: 'Library' },
          { href: '/print-queue', label: 'Print queue' },
        ]}
        rightSlot={
          <Button size="sm" iconBefore={<Plus size={14} weight="bold" />}>
            New project
          </Button>
        }
      />
      <div style={STAGE}>Projects — 14 active</div>
    </div>
  )
}

export function MarketingNav() {
  return (
    <div style={FRAME}>
      <Header
        wordmark="Subtract"
        navLinks={[
          { href: '/work', label: 'Work' },
          { href: '/writing', label: 'Writing' },
          { href: '/about', label: 'About' },
          { href: 'https://github.com', label: 'GitHub', external: true },
        ]}
      />
      <div style={STAGE}>Editorial page content</div>
    </div>
  )
}

export function WithSearchAndAccount() {
  return (
    <div style={FRAME}>
      <Header
        wordmark="Gridfinity Studio"
        navLinks={[
          { href: '/plates', label: 'Build plates' },
          { href: '/bins', label: 'Bins' },
        ]}
        rightSlot={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="secondary" size="sm" iconOnly aria-label="Search">
              <MagnifyingGlass size={14} weight="bold" />
            </Button>
            <Button variant="secondary" size="sm">
              Export STL
            </Button>
          </span>
        }
      />
      <div style={STAGE}>Build plate — 6 × 4 bins</div>
    </div>
  )
}

export function WordmarkOnly() {
  return (
    <div style={FRAME}>
      <Header wordmark="Subtract" />
      <div style={STAGE}>Minimal chrome — wordmark only</div>
    </div>
  )
}
