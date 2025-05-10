import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "./providers"
import { Navigation } from '@/components/Navigation'

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
        <Navigation />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
