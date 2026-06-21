"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Camera, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeautyChatbot } from "@/components/features/chatbot/BeautyChatbot";

const NAV = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/products", icon: ShoppingBag, label: "For You" },
  { href: "/scan", icon: Camera, label: "", fab: true },
  { href: "/wishlist", icon: Bookmark, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: "#F7F9FF" }}>
      <main className="pb-[80px]">{children}</main>
      <BeautyChatbot />

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {NAV.map((item) => {
          if (item.fab) {
            return (
              <Link key={item.href} href={item.href} className="relative -top-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-blue"
                  style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          }
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-2">
              <item.icon className={cn("w-5 h-5", active ? "text-blue-600" : "text-gray-400")} />
              <span className={cn("text-[10px] font-medium", active ? "text-blue-600" : "text-gray-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
