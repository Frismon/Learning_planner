import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: 'Learning Planner',
  description: 'Learning Planner',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
