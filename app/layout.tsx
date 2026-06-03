import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Promise Check-in Vault',
  description: 'A promise check-in vault for tracking streaks and daily proofs on Base.',
  applicationName: 'Promise Check-in Vault',
  metadataBase: new URL('https://promise-checkin-vault.vercel.app'),
  openGraph: {
    title: 'Promise Check-in Vault',
    description: 'A promise check-in vault for tracking streaks and daily proofs on Base.',
    url: 'https://promise-checkin-vault.vercel.app',
    siteName: 'Promise Check-in Vault',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Promise Check-in Vault',
    description: 'A promise check-in vault for tracking streaks and daily proofs on Base.'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a1fedf14a7867dea5dcf503" />
        <meta
          name="talentapp:project_verification"
          content="c72e1997b2a5f7c751001aaf5fe9122349136a041df6c64c06cd757abb94722c9ac31eeb56c47c32b9d1df209346c1e29836d4403d9167139361adee2266fc4e"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
