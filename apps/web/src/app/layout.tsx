import type { Metadata, Viewport } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { DemoAuthProvider } from "@/lib/demo-auth";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: { default: "GlowIQ — AI Skincare Assistant", template: "%s | GlowIQ" },
  description: "AI-powered skincare: skin analysis, ingredient safety checker, personalized routines.",
  keywords: ["skincare AI", "skin analysis", "ingredient checker", "GlowIQ"],
  authors: [{ name: "GlowIQ" }],
  creator: "GlowIQ",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F7F9FF" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${cormorant.variable} antialiased`}>
        <DemoAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <QueryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </DemoAuthProvider>
      </body>
    </html>
  );
}
