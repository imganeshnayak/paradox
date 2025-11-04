"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Download, RefreshCw, QrCode, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Artwork {
  _id: string
  title: string
  artist: string
  qrCode?: {
    url: string
    generatedAt: string
  }
}

export function QRCodeManager() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  // Load artworks
  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/artworks`)
      const data = await response.json()
      setArtworks(data.artworks || data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load artworks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateBulkQRCodes = async () => {
    try {
      setGenerating(true)
      setError(null)
      const token = localStorage.getItem('admin-token')
      
      const response = await fetch(`${backendUrl}/api/admin/qr-codes/bulk-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate QR codes')
      }

      const result = await response.json()
      setSuccess(`✅ Generated ${result.summary.success}/${result.summary.total} QR codes`)
      
      // Reload artworks to get updated QR codes
      await loadArtworks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR codes')
    } finally {
      setGenerating(false)
    }
  }

  const regenerateQRCode = async (artworkId: string) => {
    try {
      setRegeneratingId(artworkId)
      setError(null)
      const token = localStorage.getItem('admin-token')

      const response = await fetch(`${backendUrl}/api/admin/qr-codes/${artworkId}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate QR code')
      }

      setSuccess(`✅ QR code regenerated for ${artworkId}`)
      await loadArtworks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate QR code')
    } finally {
      setRegeneratingId(null)
    }
  }

  const downloadQRCode = (qrUrl: string, artworkTitle: string) => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-${artworkTitle.replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary mr-2" />
        <p className="text-foreground/60">Loading artworks...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <QrCode className="text-primary" />
            QR Code Manager
          </h2>
          <p className="text-sm text-foreground/60 mt-1">Manage and download QR codes for artworks</p>
        </div>
        <Button
          onClick={generateBulkQRCodes}
          disabled={generating}
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Generate All QR Codes
            </>
          )}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">✅ QR codes contain direct links</p>
          <p>Each QR code embeds a clickable link to the artwork detail page: <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">/artwork/{`{id}`}</code></p>
          <p className="mt-2">When scanned, users will be automatically directed to view the artwork.</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <Card key={artwork._id} className="p-4 flex flex-col">
            {/* Artwork Info */}
            <div className="mb-4 flex-1">
              <h3 className="font-semibold text-foreground line-clamp-2">{artwork.title}</h3>
              <p className="text-sm text-foreground/60">{artwork.artist}</p>
            </div>

            {/* QR Code Preview */}
            {artwork.qrCode?.url ? (
              <div className="mb-4 p-3 bg-muted rounded-lg flex flex-col items-center gap-2">
                <img
                  src={artwork.qrCode.url}
                  alt={`QR for ${artwork.title}`}
                  className="w-24 h-24 border border-border rounded"
                />
                <span className="text-xs text-foreground/60">
                  Generated: {new Date(artwork.qrCode.generatedAt).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-center h-28">
                <p className="text-xs text-foreground/40 text-center">No QR code yet</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-col sm:flex-row">
              {artwork.qrCode?.url && (
                <Button
                  onClick={() => downloadQRCode(artwork.qrCode!.url, artwork.title)}
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </Button>
              )}
              <Button
                onClick={() => regenerateQRCode(artwork._id)}
                disabled={regeneratingId === artwork._id}
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
              >
                {regeneratingId === artwork._id ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {artworks.length === 0 && (
        <Card className="p-8 text-center">
          <QrCode className="mx-auto text-foreground/20 mb-4" size={48} />
          <p className="text-foreground/60">No artworks found</p>
        </Card>
      )}
    </div>
  )
}
