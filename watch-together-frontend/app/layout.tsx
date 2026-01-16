import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Watch Together',
  description: 'Watch videos together with friends in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
