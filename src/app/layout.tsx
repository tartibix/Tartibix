import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const siteTitle = 'Tartibix Platform | Construction Resource Hub'
const siteDescription = 'Plan resources, track projects, and coordinate teams with the Tartibix dashboard experience.'

export const metadata: Metadata = {
  metadataBase: new URL('https://tartibix-platform.vercel.app'),
  title: {
    default: siteTitle,
    template: '%s | Tartibix Platform',
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: 'https://tartibix-platform.vercel.app',
    siteName: 'Tartibix Platform',
    images: [
      {
        url: '/images/login-illustration.png',
        width: 1200,
        height: 960,
        alt: 'Tartibix dashboard preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/images/login-illustration.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>{children}</body>
    </html>
  )
}
