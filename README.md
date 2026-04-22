# @clawmachine/ds

Apple-inspired design system. Private package — install directly from GitHub.

## Local preview

A Next.js preview app lives in `preview/` and consumes the design system via a `file:..` install (symlink). From the repo root:

```bash
npm run dev      # installs preview deps on first run, then starts http://localhost:3000
npm run build    # production build of the preview
npm run start    # runs the built preview
```

## Setup

### 1. Install

```bash
npm install github:YOUR_GITHUB_USERNAME/ds
```

Or pin to a specific commit/tag:

```bash
npm install github:YOUR_GITHUB_USERNAME/ds#v0.1.0
```

### 2. Configure Next.js

```js
// next.config.js / next.config.ts
const nextConfig = {
  transpilePackages: ['@clawmachine/ds'],
}
```

### 3. Add fonts

Copy the font files from `node_modules/@clawmachine/ds/public/fonts/` to your project's `public/fonts/` directory. Then load them in your root layout:

```ts
// src/app/layout.tsx
import localFont from 'next/font/local'

const indivisible = localFont({
  src: [
    { path: '../../public/fonts/IndivisibleWebRegular.woff2',     weight: '400', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebMedium.woff2',      weight: '500', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebBold.woff2',        weight: '700', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebRegularItalic.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/IndivisibleWebBoldItalic.woff2',    weight: '700', style: 'italic' },
  ],
  variable: '--font-indivisible',
})
```

### 4. Import global styles

In your root layout, import the global stylesheet:

```ts
import '@clawmachine/ds/src/styles/global.scss'
```

Apply the font variable to the `<html>` element:

```tsx
<html className={indivisible.variable}>
```

---

## Usage

### Tokens

In any `.module.scss` file:

```scss
@use '@clawmachine/ds/src/styles/tokens' as *;

.myComponent {
  color: $ink-dark;
  font-size: $text-base;
  padding: $space-16;
}
```

### Components

```tsx
import { Header } from '@clawmachine/ds'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: 'https://store.example.com', label: 'Store', external: true },
]

export default function Layout({ children }) {
  return (
    <>
      <Header
        wordmark="MyApp"
        navLinks={navLinks}
        rightSlot={<a href="/login">Sign in</a>}
      />
      {children}
    </>
  )
}
```

---

## Package name

Update the `name` field in `package.json` to match your GitHub username:

```json
{ "name": "@YOUR_GITHUB_USERNAME/ds" }
```
