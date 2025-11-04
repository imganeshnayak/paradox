"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { QRCodeManager } from "@/components/admin/qr-code-manager"

export default function QRCodesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin-token')
      if (token) {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <QRCodeManager />
        </div>
      </div>
      <Footer />
    </>
  )
}
