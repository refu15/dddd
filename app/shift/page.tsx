"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { StatusBadge } from "../components/status-badge"
import { Header } from "../components/header"
import { FooterNav } from "../components/footer-nav"

export default function ShiftPage() {
  const [date, setDate] = useState<Date>(new Date())

  // 日付のフォーマット
  const formattedDate = format(date, "yyyy年MM月dd日 (EEEEE)", { locale: ja })

  // 前日・翌日への移動
  const goToPreviousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    setDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    setDate(newDate)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="シフト" showBackButton={true} backUrl="/" />

      <main className="container mx-auto p-4">
        {/* 日付表示 */}
        <section className="mb-6">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* 表示切り替えタブ */}
        <Tabs defaultValue="day" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="day" className="text-base">
              日
            </TabsTrigger>
            <TabsTrigger value="week" className="text-base">
              週
            </TabsTrigger>
            <TabsTrigger value="month" className="text-base">
              月
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* 現在時刻のインジケーター */}
                  <div className="relative h-1">
                    <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
                    <div className="absolute left-1/3 top-0 w-2 h-2 rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-bold">08:00</span>
                    <StatusBadge status="出勤" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-bold">09:30 - 10:30</span>
                      <p className="text-sm text-[#666666]">株式会社ABC 配送</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1C3D5A] p-0 h-auto mt-1"
                        onClick={() => (window.location.href = "/delivery/DEL001")}
                      >
                        詳細を見る
                      </Button>
                    </div>
                    <StatusBadge status="配送中" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-bold">11:00 - 12:00</span>
                      <p className="text-sm text-[#666666]">株式会社DEF 配送</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1C3D5A] p-0 h-auto mt-1"
                        onClick={() => (window.location.href = "/delivery/DEL002")}
                      >
                        詳細を見る
                      </Button>
                    </div>
                    <StatusBadge status="未着手" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-bold">12:00 - 13:00</span>
                    <StatusBadge status="休憩" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-bold">14:00 - 15:00</span>
                      <p className="text-sm text-[#666666]">株式会社GHI 配送</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1C3D5A] p-0 h-auto mt-1"
                        onClick={() => (window.location.href = "/delivery/DEL003")}
                      >
                        詳細を見る
                      </Button>
                    </div>
                    <StatusBadge status="未着手" />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="font-bold">17:00</span>
                    <StatusBadge status="退勤" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-1">
                  {["月", "火", "水", "木", "金", "土", "日"].map((day, i) => (
                    <div key={i} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border rounded-md p-2 min-h-[100px] text-sm ${i === 3 ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="font-medium mb-1">{i + 1}</div>
                      {i === 3 && (
                        <>
                          <div className="bg-white border border-[#1C3D5A] text-[#1C3D5A] rounded-sm p-1 mb-1 text-xs">
                            8:00-17:00
                          </div>
                          <div className="bg-white border border-green-500 text-green-600 rounded-sm p-1 text-xs">
                            3件の配送
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-1">
                  {["月", "火", "水", "木", "金", "土", "日"].map((day, i) => (
                    <div key={i} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border rounded-md p-1 h-16 text-sm ${i === 3 ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="font-medium">{i + 1}</div>
                      {i === 3 && (
                        <div className="bg-white border border-[#1C3D5A] text-[#1C3D5A] rounded-sm p-0.5 text-xs">
                          シフト
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <FooterNav />
    </div>
  )
}

