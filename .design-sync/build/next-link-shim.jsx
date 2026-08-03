// Preview shim for `next/link` — the DS bundle renders in a plain browser
// (no Next router), so Link degrades to a native anchor. Semantically correct
// for a static design preview.
import React from 'react'
export default function Link({ href, children, ...rest }) {
  const h = typeof href === 'string' ? href : (href && href.pathname) || '#'
  return React.createElement('a', { href: h, ...rest }, children)
}
