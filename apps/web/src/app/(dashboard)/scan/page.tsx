"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Camera, Upload, Zap, RotateCcw, AlertCircle, ImageIcon } from "lucide-react";

type Mode = "webcam" | "upload";

export default function ScanPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(
    typeof window !== "undefined" && !window.isSecureContext ? "upload" : "webcam"
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (!window.isSecureContext) {
      setCameraError("Camera needs HTTPS. Use Upload Photo instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      setCameraError("Camera access denied. Please allow camera or use Upload Photo.");
    }
  }, []);

  useEffect(() => {
    if (mode === "webcam" && !preview) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode, preview, startCamera, stopCamera]);

  const capture = () => {
    if (!videoRef.current || !cameraActive) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    stopCamera();
    setPreview(canvas.toDataURL("image/jpeg", 0.85));
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mode === "webcam") startCamera();
  };

  const analyze = async () => {
    if (!preview || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/face/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Analysis failed");
      sessionStorage.setItem(`face_${data.scanId}`, JSON.stringify({ ...data, imageBase64: preview }));
      router.push(`/scan/result/${data.scanId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-8" style={{ background: "#0D1526" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/home"><X className="w-6 h-6 text-white" /></Link>
        <span className="text-white font-semibold">AI Skin Analysis</span>
        {preview ? (
          <button onClick={reset}><RotateCcw className="w-5 h-5 text-white opacity-60" /></button>
        ) : <div className="w-5" />}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        {(["webcam", "upload"] as Mode[]).map(m => (
          <button key={m} onClick={() => { setPreview(null); setMode(m); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm"
            style={{
              background: mode === m ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "rgba(255,255,255,0.08)",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
            }}>
            {m === "webcam" ? <Camera className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {m === "webcam" ? "Selfie Camera" : "Upload Photo"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-3 px-4 py-3 rounded-2xl text-sm text-red-300 flex items-center gap-2"
          style={{ background: "rgba(239,68,68,0.15)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Camera / Upload / Preview area */}
      <div className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
        style={{ background: "#111827", minHeight: 320 }}>

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Face" className="w-full h-full object-cover absolute inset-0" />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "rgba(0,0,0,0.65)" }}>
                {/* Animated face oval */}
                <div className="relative w-40 h-48 mb-4">
                  <div className="w-40 h-48 rounded-full border-2 border-blue-400"
                    style={{ boxShadow: "0 0 30px rgba(59,130,246,0.6)", animation: "pulse 1.5s ease infinite" }} />
                  <div className="absolute inset-x-0 h-0.5 rounded"
                    style={{ background: "linear-gradient(90deg,transparent,#3B82F6,transparent)",
                      animation: "scanFace 1.4s ease-in-out infinite", top: "10%" }} />
                </div>
                <p className="text-white font-medium animate-pulse">Analyzing your skin with AI…</p>
                <p className="text-white/50 text-xs mt-1">This takes 10–15 seconds</p>
              </div>
            )}
          </>
        ) : mode === "webcam" ? (
          <>
            <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            {/* Face guide oval */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-56 rounded-full border-2"
                style={{ borderColor: cameraActive ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.3)" }} />
            </div>
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-red-300 text-sm text-center">{cameraError}</p>
                <button onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white"
                  style={{ background: "rgba(59,130,246,0.3)" }}>
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
              </div>
            )}
            {cameraActive && (
              <p className="absolute bottom-4 text-white/50 text-xs">Center your face in the oval</p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 cursor-pointer w-full h-full justify-center"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: "rgba(37,99,235,0.15)", border: "2px dashed rgba(59,130,246,0.4)" }}>
              <ImageIcon className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-white font-medium">Upload a selfie photo</p>
            <p className="text-white/40 text-sm text-center">Tap to choose from gallery or drag & drop</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}
      </div>

      {/* Tips */}
      {!preview && !loading && (
        <div className="grid grid-cols-3 gap-2 my-4">
          {["Good lighting", "Face forward", "No glasses"].map(tip => (
            <div key={tip} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
              <p className="text-white text-xs opacity-70">{tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action button */}
      <div className={preview ? "mt-4" : ""}>
        {preview && !loading ? (
          <button onClick={analyze}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)" }}>
            <Zap className="w-5 h-5" /> Analyze My Skin
          </button>
        ) : !preview && mode === "webcam" && cameraActive ? (
          <button onClick={capture}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)" }}>
            <Camera className="w-5 h-5" /> Take Selfie
          </button>
        ) : !preview && mode === "upload" ? (
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)" }}>
            <Upload className="w-5 h-5" /> Choose Photo
          </button>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes scanFace { 0%,100% { top:10%; } 50% { top:80%; } }
      `}</style>
    </div>
  );
}
