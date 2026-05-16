import localFont from 'next/font/local'
import '@subtract/ds/styles/global.scss'
import './layout.scss'

const indivisible = localFont({
  src: [
    { path: '../../public/fonts/IndivisibleWebRegular.woff2',      weight: '400', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebMedium.woff2',       weight: '500', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebBold.woff2',         weight: '700', style: 'normal' },
    { path: '../../public/fonts/IndivisibleWebRegularItalic.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/IndivisibleWebBoldItalic.woff2',   weight: '700', style: 'italic' },
  ],
  variable: '--font-indivisible',
})

export const metadata = { title: 'Design System Preview' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={indivisible.variable}>
      <body>{children}</body>
    </html>
  )
}
