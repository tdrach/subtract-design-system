// Layer-A build for design-sync (run from the repo root).
// Compiles the DS source (raw TS + SCSS modules) into an esbuild-digestible
// dist/ the design-sync converter then bundles:
//   - .module.scss -> css-modules (hashed class strings inlined in JS,
//     matching selectors extracted to dist/index.css)
//   - global.scss  -> plain global css (tokens :root + base) in dist/index.css
//   - peers (react/visx/radix/phosphor) left external for Layer B to inline
//   - next/link aliased to a plain <a> shim (no Next router in the preview)
// Deps (esbuild, sass) resolve via the .design-sync/node_modules symlink ->
// ../.ds-sync/node_modules (recreate on a fresh clone; see NOTES.md).
import { build } from 'esbuild'
import * as sass from 'sass'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Map the DS's own package self-imports (`@use '@subtract/ds/styles/…'`,
// dogfooding the exports map ./styles/* -> ./src/styles/*) back to source.
const selfImporter = {
  findFileUrl(url) {
    if (!url.startsWith('@subtract/ds/')) return null
    let rel = url.slice('@subtract/ds/'.length)
    if (rel.startsWith('styles/')) rel = 'src/' + rel
    else if (!rel.startsWith('src/')) rel = 'src/' + rel
    return pathToFileURL(resolve(rel))
  },
}

const scssPlugin = {
  name: 'scss',
  setup(b) {
    b.onLoad({ filter: /\.scss$/ }, (args) => {
      const result = sass.compile(args.path, {
        loadPaths: [dirname(args.path), resolve('src/styles')],
        importers: [selfImporter],
        style: 'expanded',
      })
      const isModule = args.path.endsWith('.module.scss')
      return { contents: result.css, loader: isModule ? 'local-css' : 'css' }
    })
  },
}

const nextLinkShim = {
  name: 'next-link',
  setup(b) {
    b.onResolve({ filter: /^next\/link$/ }, () => ({
      path: resolve('.design-sync/build/next-link-shim.jsx'),
    }))
  },
}

await build({
  entryPoints: ['.design-sync/build/dsentry.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  outfile: 'dist/index.js',
  packages: 'external',
  jsx: 'automatic',
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl' },
  plugins: [nextLinkShim, scssPlugin],
  define: { 'process.env.NODE_ENV': '"development"' },
  logLevel: 'info',
  minify: false,
})
console.log('Layer A build done')
