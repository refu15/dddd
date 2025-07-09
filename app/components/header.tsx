'use client'

import Link from "next/link"
import { ChevronLeft, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationBell } from "./notification-bell"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  showAvatar?: boolean
  showNotifications?: boolean
  backUrl?: string
}

export function Header({
  title,
  showBackButton = false,
  showAvatar = true,
  showNotifications = true,
  backUrl = "/",
}: HeaderProps) {
  const { data: session } = useSession()

  const user = session?.user
  // @ts-ignore
  const isAdmin = user?.role === "admin"
  const userName = user?.name || "U"
  const userInitials = userName.substring(0, 2)

  return (
    <header className="bg-white text-[#1C3D5A] p-4 sticky top-0 z-20 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <Link href={backUrl}>
              <Button variant="ghost" size="icon" className="mr-2 text-[#1C3D5A]">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline">管理者ページ</Button>
            </Link>
          )}
          {showNotifications && <NotificationBell />}

          {showAvatar && user && (
            <Link href="/profile">
              <Avatar className="h-9 w-9 bg-[#F6C238]">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Link>
          )}
          {user && (
            <Button onClick={() => signOut()} variant="ghost" size="icon" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

