import type React from "react"
import type { Metadata } from "next"
import { Lora, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { InstantFeedbackSystem } from "@/components/instant-feedback-system"
import { SessionProvider } from "@/components/session-provider"
import { ConsentBanner } from "@/components/consent-banner"

const _lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ArtVerse - Museum Companion",
  description: "Discover artworks with audio guides, interactive content, and personalized recommendations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_lora.className} antialiased`}>
        <SessionProvider>
          {children}
          <ConsentBanner />
          <InstantFeedbackSystem />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
