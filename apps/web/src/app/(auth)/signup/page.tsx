"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => { setTimeout(() => router.push("/home"), 1000); }, [router]);
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-beauty-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 mx-auto mb-4 flex items-center justify-center shadow-gold">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-playfair text-2xl font-bold text-dark dark:text-white mb-2">BeautyIQ AI</h1>
        <p className="text-gray-500 text-sm">Demo mode — creating your account...</p>
      </div>
    </div>
  );
}
