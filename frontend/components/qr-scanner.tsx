"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string) => void
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!isOpen) return

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Simulate QR code detection - in production, use qr-scanner library
        setTimeout(() => {
          onScan("/artwork/1")
          onClose()
        }, 2000)
      } catch (err) {
        setError("Unable to access camera. Please check permissions.")
      }
    }

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isOpen, onClose, onScan])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-square bg-muted rounded-lg border border-border"
            />
            <p className="text-sm text-foreground/60 text-center">Point your camera at a QR code</p>
          </div>
        )}

        <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
