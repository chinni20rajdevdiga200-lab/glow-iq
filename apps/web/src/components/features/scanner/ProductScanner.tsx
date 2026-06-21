"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload, X, Zap, RotateCcw, ImageIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "webcam" | "upload";

interface Props {
  onCapture: (base64: string) => void;
  loading?: boolean;
}

export function ProductScanner({ onCapture, loading = false }: Props) {
  const [mode, setMode] = useState<Mode>(
    typeof window !== "undefined" && !window.isSecureContext ? "upload" : "webcam"
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);

    // Browsers block camera on plain HTTP (non-localhost)
    if (!window.isSecureContext) {
      setCameraError("Camera requires HTTPS. Please use the Upload Photo option instead — it works on any connection.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera not supported on this browser. Use Upload Photo instead.");
      return;
    }

    // Try rear camera first, fall back to any camera
    const constraints = [
      { video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: "environment" } },
      { video: true },
    ];
    let stream: MediaStream | null = null;
    for (const c of constraints) {
      try { stream = await navigator.mediaDevices.getUserMedia(c); break; } catch {}
    }
    if (!stream) {
      setCameraError("Camera access denied. Tap Allow when browser asks, or use Upload Photo.");
      return;
    }
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
      setCameraActive(true);
    }
  }, []);

  useEffect(() => {
    if (mode === "webcam" && !preview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, preview, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !cameraActive) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    setPreview(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPreview(null);
    setScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mode === "webcam") startCamera();
  };

  const handleAnalyze = () => {
    if (!preview || loading) return;
    setScanning(true);
    onCapture(preview);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        {(["webcam", "upload"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setPreview(null); setMode(m); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm transition-all"
            style={{
              background: mode === m ? "linear-gradient(135deg, #2563EB, #3B82F6)" : "rgba(255,255,255,0.08)",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.6)",
            }}
          >
            {m === "webcam" ? <Camera className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {m === "webcam" ? "Use Camera" : "Upload Photo"}
          </button>
        ))}
      </div>

      {/* Preview or camera/upload area */}
      <div className="flex-1 relative rounded-3xl overflow-hidden" style={{ minHeight: 300, background: "#111827" }}>
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Product label" className="w-full h-full object-contain" />
              {/* Scan animation overlay */}
              {(scanning || loading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <div className="relative w-48 h-48">
                    {/* Corner brackets */}
                    {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-8 h-8`}
                        style={{
                          borderTop: pos.includes("top") ? "2px solid #3B82F6" : "none",
                          borderBottom: pos.includes("bottom") ? "2px solid #3B82F6" : "none",
                          borderLeft: pos.includes("left") ? "2px solid #3B82F6" : "none",
                          borderRight: pos.includes("right") ? "2px solid #3B82F6" : "none",
                        }} />
                    ))}
                    <div className="absolute inset-x-0 h-0.5 rounded"
                      style={{
                        background: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
                        animation: "scanLine 1.4s ease-in-out infinite",
                        top: "10%",
                      }} />
                  </div>
                  <p className="text-white text-sm mt-4 font-medium animate-pulse">
                    {loading ? "Analyzing ingredients with AI…" : "Preparing scan…"}
                  </p>
                </div>
              )}
              {/* Reset button */}
              {!scanning && !loading && (
                <button onClick={reset}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </motion.div>
          ) : mode === "webcam" ? (
            <motion.div
              key="webcam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {cameraError ? (
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.15)" }}>
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-red-400 text-sm">{cameraError}</p>
                  <button onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: "rgba(59,130,246,0.3)" }}>
                    <RotateCcw className="w-4 h-4" /> Retry
                  </button>
                </div>
              ) : (
                <>
                  <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-64 h-40">
                      {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-8 h-8`}
                          style={{
                            borderTop: pos.includes("top") ? "2px solid rgba(59,130,246,0.8)" : "none",
                            borderBottom: pos.includes("bottom") ? "2px solid rgba(59,130,246,0.8)" : "none",
                            borderLeft: pos.includes("left") ? "2px solid rgba(59,130,246,0.8)" : "none",
                            borderRight: pos.includes("right") ? "2px solid rgba(59,130,246,0.8)" : "none",
                          }} />
                      ))}
                    </div>
                  </div>
                  {cameraActive && (
                    <p className="absolute bottom-4 text-white/60 text-xs">
                      Point at ingredient label
                    </p>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer" }}
            >
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.15)", border: "2px dashed rgba(59,130,246,0.4)" }}>
                <ImageIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium mb-1">Drop photo here</p>
                <p className="text-white/50 text-sm">or tap to choose from gallery</p>
              </div>
              <p className="text-white/30 text-xs">JPG, PNG, HEIC up to 10 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-3">
        {preview ? (
          <button
            onClick={handleAnalyze}
            disabled={loading || scanning}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 transition-all"
            style={{
              background: loading || scanning ? "#374151" : "linear-gradient(135deg, #2563EB, #3B82F6)",
              opacity: loading || scanning ? 0.8 : 1,
            }}
          >
            <Zap className="w-5 h-5" />
            {loading ? "Analyzing…" : "Analyze Ingredients"}
          </button>
        ) : mode === "webcam" && cameraActive ? (
          <button
            onClick={capturePhoto}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
          >
            <Camera className="w-5 h-5" /> Capture Photo
          </button>
        ) : mode === "upload" ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
          >
            <Upload className="w-5 h-5" /> Choose Photo
          </button>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; }
          50% { top: 80%; }
        }
      `}</style>
    </div>
  );
}
