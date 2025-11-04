'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface ImageScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImageScanner({ isOpen, onClose }: ImageScannerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [result, setResult] = useState<any>(null);

  // Initialize camera when scanner opens
  useEffect(() => {
    if (!isOpen || mode !== 'camera') return;

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
      setIsScanning(false);
    };
  }, [isOpen, mode]);

  /**
   * Capture image from camera and send to Gemini API
   */
  const captureAndAnalyze = useCallback(async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image as base64
      const imageBase64 = canvas.toDataURL('image/jpeg').split('base64,')[1];

      await analyzeImage(imageBase64);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Capture failed');
    }
  }, []);

  /**
   * Handle file upload
   */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imageBase64 = (event.target?.result as string).split('base64,')[1];
        await analyzeImage(imageBase64);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Upload failed');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Send image to backend for Gemini analysis
   */
  interface ImageAnalyzeResponse {
    success: boolean;
    artwork?: {
      id: string;
      title: string;
    };
    metadata?: {
      artist?: string;
      period?: string;
      style?: string;
      description?: string;
    };
    matchScore?: number;
    allMatches?: any[];
    error?: string;
  }

  const analyzeImage = async (imageBase64: string) => {
    try {
      setIsAnalyzing(true);
      setError('');
      setIsScanning(false);

      console.log('📸 Sending image to Gemini API...');

      const response = await apiClient.post<ImageAnalyzeResponse>('/images/recognize', {
        imageBase64: `data:image/jpeg;base64,${imageBase64}`,
      });

      const data = response.data as ImageAnalyzeResponse;

      if (data && data.success) {
        setResult(data);
        console.log('✅ Artwork identified:', data.artwork?.title);
      } else {
        setError((data && data.error) || 'No matching artwork found');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Navigate to artwork page
   */
  const goToArtwork = (artworkId: string) => {
    handleClose();
    router.push(`/artwork/${artworkId}`);
  };

  const handleClose = useCallback(() => {
    setIsScanning(false);
    setIsAnalyzing(false);
    setError('');
    setResult(null);
    setMode('camera');

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
            {result ? 'Artwork Match' : 'Scan Artwork'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {!result ? (
            <>
              {/* Mode Selection */}
              {!isAnalyzing && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setMode('camera')}
                    variant={mode === 'camera' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                  >
                    <Camera size={16} className="mr-1" />
                    Camera
                  </Button>
                  <Button
                    onClick={() => setMode('upload')}
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                  >
                    <Upload size={16} className="mr-1" />
                    Upload
                  </Button>
                </div>
              )}

              {/* Camera Mode */}
              {mode === 'camera' && (
                <>
                  {hasPermission ? (
                    <>
                      <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border-2 border-primary">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Scanning Overlay */}
                        {isScanning && !isAnalyzing && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-3/4 h-3/4 border-2 border-primary rounded-lg">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                            </div>
                          </div>
                        )}

                        {/* Loading Overlay */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
                              <p className="text-white text-sm">Analyzing image...</p>
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded px-3 py-2 flex items-center gap-2">
                          <Loader2 className="animate-spin text-primary" size={16} />
                          <span className="text-white text-sm">
                            {isAnalyzing ? 'Analyzing...' : 'Position artwork in frame'}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/70 text-center">
                        Point your camera at an artwork and tap Capture
                      </p>

                      <Button
                        onClick={captureAndAnalyze}
                        disabled={isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={16} />
                            Analyzing...
                          </>
                        ) : (
                          'Capture & Analyze'
                        )}
                      </Button>
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
                </>
              )}

              {/* Upload Mode */}
              {mode === 'upload' && (
                <>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square bg-muted rounded-lg border-2 border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition"
                  >
                    <Upload size={48} className="text-primary mb-2" />
                    <p className="text-primary font-medium">Click to upload</p>
                    <p className="text-foreground/60 text-sm">or drag and drop</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-medium">✅ Match Found!</p>
                    <p className="text-sm text-green-600">
                      Confidence: {result.matchScore}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{result.artwork.title}</h3>
                  <p className="text-foreground/70 text-sm">{result.metadata.artist}</p>
                  <p className="text-foreground/60 text-xs">
                    {result.metadata.period} • {result.metadata.style}
                  </p>
                  <p className="text-foreground/70 text-sm mt-2">
                    {result.metadata.description}
                  </p>
                </div>

                {result.allMatches.length > 1 && (
                  <div className="text-xs text-foreground/60">
                    {result.allMatches.length} similar artworks found
                  </div>
                )}
              </div>

              <Button
                onClick={() => goToArtwork(result.artwork.id)}
                className="w-full bg-primary"
              >
                View Artwork Details
              </Button>
            </>
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <Button onClick={handleClose} variant="outline" className="flex-1">
            {result ? 'Close' : 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
