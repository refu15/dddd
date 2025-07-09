'use client'

import { useState } from "react"
import { User, Mail, Phone, MapPin, FileText, Settings, LogOut, ChevronRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Header } from "../components/header"
import { FooterNav } from "../components/footer-nav"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState(true)
  const [locationTracking, setLocationTracking] = useState(true)

  const user = session?.user

  // Fallback for user data if not available (e.g., still loading or not logged in)
  const userProfile = {
    name: user?.name || "ゲスト",
    email: user?.email || "N/A",
    phone: "N/A", // This data is not in session, needs to be fetched from DB if available
    employeeId: user?.id || "N/A", // Using user ID as employee ID for now
    area: "N/A", // Not in session
    joinDate: "N/A", // Not in session
    licenseType: "N/A", // Not in session
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="プロフィール" showBackButton={true} backUrl="/" showAvatar={false} />

      <main className="container mx-auto p-4">
        {/* プロフィールヘッダー */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 bg-[#F6C238] mb-4">
            <AvatarFallback className="text-2xl">{userProfile.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{userProfile.name}</h2>
          <p className="text-[#666666]">{userProfile.employeeId}</p>
        </div>

        {/* 基本情報 */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">基本情報</h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">メールアドレス</p>
                  <p className="text-[#666666]">{userProfile.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">電話番号</p>
                  <p className="text-[#666666]">{userProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">担当エリア</p>
                  <p className="text-[#666666]">{userProfile.area}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FileText className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">保有免許</p>
                  <p className="text-[#666666]">{userProfile.licenseType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 設定 */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">設定</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">通知</p>
                  <p className="text-sm text-[#666666]">プッシュ通知を受け取る</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">位置情報</p>
                  <p className="text-sm text-[#666666]">勤務中の位置情報を共有</p>
                </div>
                <Switch checked={locationTracking} onCheckedChange={setLocationTracking} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* その他のメニュー */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-0">
            <ul className="divide-y">
              <li>
                <Link href="/profile/attendance" passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#1C3D5A] mr-3" />
                      <span>勤怠ログ</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                </Link>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => alert("アカウント設定")}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-[#1C3D5A] mr-3" />
                    <span>アカウント設定</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => alert("ヘルプ・サポート")}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#1C3D5A] mr-3" />
                    <span>ヘルプ・サポート</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* ログアウト */}
        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          ログアウト
        </Button>
      </main>

      <FooterNav />
    </div>
  )
}

