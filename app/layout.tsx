import type { Metadata } from 'next'
<<<<<<< HEAD
import './globals.css'
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: 'Learning Planner',
  description: 'Learning Planner',
=======
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Learning Planner',
  description: 'Планувальник навчання',
>>>>>>> 675f89b (added UI for study-plan)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
<<<<<<< HEAD
      <body>
=======
      <body className={inter.className}>
        <Navigation />
>>>>>>> 675f89b (added UI for study-plan)
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
