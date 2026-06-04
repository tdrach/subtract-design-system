import localFont from 'next/font/local'
import '@subtract/ds/styles/global.scss'
import './layout.scss'

const indivisible = localFont({
  src: [
    // Paths resolve to ds/public/fonts (not preview/public) so new cuts are picked up without re-running predev
    { path: '../../../public/fonts/IndivisibleWebRegular.woff2',        weight: '400', style: 'normal' },
    { path: '../../../public/fonts/IndivisibleWebMedium.woff2',         weight: '500', style: 'normal' },
    { path: '../../../public/fonts/IndivisibleWebSemiBold.woff2',       weight: '600', style: 'normal' },
    { path: '../../../public/fonts/IndivisibleWebSemiBold.woff2',       weight: '700', style: 'normal' },
    { path: '../../../public/fonts/IndivisibleWebBold.woff2',          weight: '800', style: 'normal' },
    { path: '../../../public/fonts/IndivisibleWebRegularItalic.woff2', weight: '400', style: 'italic' },
    { path: '../../../public/fonts/IndivisibleWebSemiBoldItalic.woff2', weight: '600', style: 'italic' },
    { path: '../../../public/fonts/IndivisibleWebSemiBoldItalic.woff2', weight: '700', style: 'italic' },
    { path: '../../../public/fonts/IndivisibleWebBoldItalic.woff2',     weight: '800', style: 'italic' },
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
