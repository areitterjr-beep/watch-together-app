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
  // Debug script that runs immediately
  if (typeof window !== 'undefined') {
    console.log('📄 Root layout loaded');
  }
  
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🚀 Script loaded - JavaScript is working!');
              console.log('📍 Current URL:', window.location.href);
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
