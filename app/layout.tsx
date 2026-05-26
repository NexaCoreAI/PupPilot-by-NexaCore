import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Four Leg Life — Daily Dog Care',
  description: 'The modern daily care management app for dog owners.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
