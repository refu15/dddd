"use client"

import { useState } from "react"
import { Bell, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "../components/header"
import { FooterNav } from "../components/footer-nav"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  important?: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "システムメンテナンス",
      message:
        "3月31日 23:00〜翌2:00までシステムメンテナンスを実施します。この間はシステムをご利用いただけません。ご了承ください。",
      time: "2025/3/28 10:30",
      read: false,
      important: true,
    },
    {
      id: "2",
      title: "安全運転講習のご案内",
      message:
        "4月15日に安全運転講習を実施します。参加可能な方は管理者までご連絡ください。場所：本社会議室、時間：14:00〜16:00",
      time: "2025/3/27 15:45",
      read: false,
    },
    {
      id: "3",
      title: "新規案件のお知らせ",
      message: "4月1日より新規配送エリアが追加されます。詳細は資料をご確認ください。",
      time: "2025/3/26 09:15",
      read: true,
    },
    {
      id: "4",
      title: "車両点検のお知らせ",
      message: "定期車両点検が4月5日に予定されています。当日は車両をご持参ください。",
      time: "2025/3/25 11:20",
      read: true,
    },
    {
      id: "5",
      title: "給与明細のお知らせ",
      message: "3月分の給与明細が発行されました。マイページからご確認いただけます。",
      time: "2025/3/24 17:00",
      read: true,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="通知" showBackButton={true} backUrl="/" showNotifications={false} />

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">通知一覧</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-[#1C3D5A]" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-1" />
              すべて既読にする
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 h-12 mb-4">
            <TabsTrigger value="all" className="text-base">
              すべて
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-base">
              未読 {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">通知はありません</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread">
            {notifications.filter((n) => !n.read).length > 0 ? (
              <div className="space-y-4">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">未読の通知はありません</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <FooterNav />
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-200 ${
        notification.read ? "bg-white" : "bg-blue-50 border-blue-100"
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold">{notification.title}</h3>
        {notification.important && <Badge className="bg-red-500">重要</Badge>}
      </div>
      <p className="text-[#666666] mb-2">{notification.message}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{notification.time}</p>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-[#1C3D5A]"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
          >
            既読にする
          </Button>
        )}
      </div>
    </div>
  )
}

