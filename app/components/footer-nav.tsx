"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Truck, Calendar, Bell, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FooterNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "案件",
      href: "/delivery",
      icon: Truck,
    },
    {
      name: "シフト",
      href: "/shift",
      icon: Calendar,
    },
    {
      name: "通知",
      href: "/notifications",
      icon: Bell,
    },
    {
      name: "資料",
      href: "/documents",
      icon: FileText,
    },
    {
      name: "プロフィール",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <nav className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link href={item.href} key={item.name} className="w-full h-full">
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center justify-center h-full w-full rounded-none",
                  isActive ? "text-[#1C3D5A] font-medium" : "text-gray-500",
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive ? "text-[#1C3D5A]" : "text-gray-500")} />
                <span className="text-xs">{item.name}</span>
                {isActive && <div className="absolute bottom-0 w-12 h-0.5 bg-[#1C3D5A] rounded-t-full" />}
              </Button>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

