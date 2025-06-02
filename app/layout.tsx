import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "./providers"
import { Navigation } from '@/components/Navigation'
import { ThemeProvider } from 'next-themes'

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
