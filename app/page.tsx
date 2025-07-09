import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyProgress } from "./components/daily-progress"
import { DeliveryCard } from "./components/delivery-card"
import { FooterNav } from "./components/footer-nav"
import { Header } from "./components/header"
import { WeatherWidget } from "./components/weather-widget"
import { LocationTracker } from "./components/location-tracker";
import { AttendanceButtons } from "./components/attendance-buttons";

// 将来的にはデータベースから取得します
const deliveryItems: any[] = []

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    // Middlewareで処理されるはずですが、念のため
    redirect("/login")
  }

  // 時間帯に応じた挨拶
  const now = new Date()
  const hours = now.getHours()
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }
  const dateString = now.toLocaleDateString("ja-JP", dateOptions)

  let greeting = "こんにちは"
  if (hours < 12) {
    greeting = "おはようございます"
  } else if (hours >= 18) {
    greeting = "こんばんは"
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="ホーム" showBackButton={false} />

      <main className="container mx-auto p-4">
        {/* 挨拶と日付 */}
        <section className="mb-5 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-1">
            {session.user.name}さん、{greeting}！
          </h2>
          <p className="text-[#666666]">{dateString}</p>
        </section>

        {/* 位置情報追跡コンポーネント */}
        <section className="mb-5">
          <LocationTracker />
        </section>

        {/* 天気と進捗状況 */}
        <section className="mb-6 animate-slideInRight grid grid-cols-2 gap-4">
          <WeatherWidget />
          <DailyProgress totalDeliveries={0} completedDeliveries={0} />
        </section>

        {/* 出退勤ボタン */}
        <section className="mb-6 animate-slideInUp">
          <AttendanceButtons />
        </section>

        {/* 今日の予定 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">今日の予定</h2>
            <Link href="/shift">
              <Button variant="outline" size="sm" className="text-[#1C3D5A] border-[#1C3D5A]">
                <Calendar className="mr-2 h-4 w-4" />
                カレンダー
              </Button>
            </Link>
          </div>

          <Card className="mb-4 shadow-sm">
            <CardContent className="p-4">
              <p className="text-gray-500">今日のシフト情報はありません。</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 mb-4">
              <TabsTrigger value="all">全て</TabsTrigger>
              <TabsTrigger value="ongoing">進行中</TabsTrigger>
              <TabsTrigger value="upcoming">未着手</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="min-h-[100px]">
              {deliveryItems.length > 0 ? (
                deliveryItems.map((item, index) => <DeliveryCard key={index} item={item} />)
              ) : (
                <p className="text-center text-gray-500 pt-8">表示する配送案件がありません。</p>
              )}
            </TabsContent>
            <TabsContent value="ongoing" className="min-h-[100px]">
               <p className="text-center text-gray-500 pt-8">表示する配送案件がありません。</p>
            </TabsContent>
            <TabsContent value="upcoming" className="min-h-[100px]">
               <p className="text-center text-gray-500 pt-8">表示する配送案件がありません。</p>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Link href="/delivery">
              <Button variant="outline" className="text-[#1C3D5A] border-[#1C3D5A]">
                すべての案件を見る
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <FooterNav />
    </div>
  )
}

