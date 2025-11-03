"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRScanner } from "@/components/qr-scanner"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [qrScannerOpen, setQRScannerOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin token exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin-token')
      setIsAdmin(!!token)
    }
  }, [])

  const handleQRScan = (result: string) => {
    router.push(result)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif text-2xl font-bold text-primary">
              ArtVerse
            </Link>

            <div className="hidden md:flex gap-8">
              <Link href="/explore" className="text-foreground hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/museum-map" className="text-foreground hover:text-primary transition-colors">
                Museum Map
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex gap-2">
              <Button onClick={() => setQRScannerOpen(true)} variant="outline" size="icon" title="Scan QR Code">
                <Scan size={20} />
              </Button>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-4">
              <Link href="/explore" className="text-foreground hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/museum-map" className="text-foreground hover:text-primary transition-colors">
                Museum Map
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <Button
                onClick={() => {
                  setQRScannerOpen(true)
                  setIsOpen(false)
                }}
                variant="outline"
                className="w-full justify-start"
              >
                <Scan size={20} className="mr-2" />
                Scan QR Code
              </Button>
            </div>
          )}
        </div>
      </nav>

      <QRScanner isOpen={qrScannerOpen} onClose={() => setQRScannerOpen(false)} onScan={handleQRScan} />
    </>
  )
}
