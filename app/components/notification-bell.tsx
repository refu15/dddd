"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  important?: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "システムメンテナンス",
      message: "3月31日 23:00〜翌2:00までシステムメンテナンスを実施します。",
      time: "2025/3/28 10:30",
      read: false,
      important: true,
    },
    {
      id: "2",
      title: "安全運転講習のご案内",
      message: "4月15日に安全運転講習を実施します。参加可能な方は管理者までご連絡ください。",
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
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">通知</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={markAllAsRead}>
              すべて既読にする
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${notification.read ? "bg-white" : "bg-blue-50"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {notification.important && <Badge className="bg-red-500">重要</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">通知はありません</div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full">
            すべての通知を見る
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

