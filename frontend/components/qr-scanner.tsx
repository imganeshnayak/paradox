'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (artworkId: string) => void;
}

declare global {
  interface Window {
    QRCode?: any;
  }
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load jsQR library
  useEffect(() => {
    if (window.QRCode) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    document.head.appendChild(script);
  }, []);

  // Initialize camera when scanner opens
  useEffect(() => {
    if (!isOpen) return;

    const initCamera = async () => {
      try {
        setError('');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setIsScanning(true);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to access camera';
        setError(errorMessage);
        setHasPermission(false);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Scan for QR codes
  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current || !window.QRCode) return;

    scanIntervalRef.current = setInterval(() => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const code = window.QRCode.decode(imageData);
        if (code) {
          handleScanSuccess(code);
        }
      } catch (e) {
        // No QR code found in frame, continue scanning
      }
    }, 300);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning]);

  const handleScanSuccess = useCallback(
    (qrData: string) => {
      setIsScanning(false);
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }

      // Parse QR data - expecting format: "artwork:{artworkId}"
      const match = qrData.match(/artwork:([a-zA-Z0-9_-]+)/);
      const artworkId = match ? match[1] : qrData;

      // Track scan event
      trackScanEvent(artworkId);

      onScan(artworkId);
    },
    [onScan]
  );

  const trackScanEvent = async (artworkId: string) => {
    try {
      await apiClient.post('/analytics/scan', {
        artworkId,
        timestamp: Date.now(),
        scanMethod: 'qr',
      });
    } catch (error) {
      console.error('Failed to track scan event:', error);
    }
  };

  const handleClose = useCallback(() => {
    setIsScanning(false);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Camera size={20} />
            Scan Artwork QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {hasPermission ? (
            <>
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border-2 border-primary">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4 border-2 border-primary rounded-lg">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded px-3 py-2 flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={16} />
                  <span className="text-white text-sm">
                    {isScanning ? 'Scanning...' : 'Point at QR code'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-foreground/70 text-center">
                Position the QR code within the frame for automatic detection
              </p>
            </>
          ) : hasPermission === false ? (
            <div className="w-full aspect-square bg-red-50 rounded-lg border-2 border-red-300 flex flex-col items-center justify-center p-4">
              <Camera className="text-red-500 mb-3" size={48} />
              <p className="text-red-700 font-medium text-center">Camera Access Denied</p>
              <p className="text-red-600 text-sm text-center mt-2">
                Please enable camera permission in your browser settings.
              </p>
            </div>
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <Button onClick={handleClose} variant="outline" className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
