"use client"

import { useState } from "react"
import { MapPin, Package, Clock, User, Phone, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "../../components/status-badge"
import { Header } from "../../components/header"
import { FooterNav } from "../../components/footer-nav"

export default function DeliveryDetailPage({ params }: { params: { id: string } }) {
  // 実際のアプリでは、IDに基づいて案件データを取得する
  const [deliveryItem, setDeliveryItem] = useState({
    id: params.id,
    time: "09:30 - 10:30",
    address: "東京都新宿区西新宿1-1-1 ABCビル 3階",
    customer: "株式会社ABC",
    contactPerson: "田中太郎",
    phone: "03-1234-5678",
    status: "配送中",
    items: "段ボール 3箱",
    weight: "15kg",
    notes: "正面玄関から入り、受付で配送物があることを伝えてください。駐車場は建物裏にあります。",
    vehicle: "軽トラック（品川 あ 12-34）",
    history: [
      { time: "08:15", action: "出発", note: "営業所を出発" },
      { time: "09:20", action: "到着", note: "配送先に到着" },
      { time: "09:25", action: "配送中", note: "荷物を運搬中" },
    ],
  })

  const [completionNote, setCompletionNote] = useState("")

  // 配送完了処理
  const handleComplete = () => {
    setDeliveryItem({
      ...deliveryItem,
      status: "完了",
      history: [
        ...deliveryItem.history,
        {
          time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
          action: "完了",
          note: completionNote || "配送完了",
        },
      ],
    })
  }

  // 遅延報告処理
  const handleDelay = (reason: string) => {
    setDeliveryItem({
      ...deliveryItem,
      status: "遅延",
      history: [
        ...deliveryItem.history,
        {
          time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
          action: "遅延",
          note: reason,
        },
      ],
    })
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="案件詳細" showBackButton={true} backUrl="/delivery" />

      <main className="container mx-auto p-4">
        {/* ステータスバナー */}
        {deliveryItem.status === "完了" && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">この配送は完了しています</p>
          </div>
        )}

        {deliveryItem.status === "遅延" && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-700">この配送は遅延が報告されています</p>
          </div>
        )}

        {/* 案件概要 */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{deliveryItem.customer}</h2>
              <StatusBadge status={deliveryItem.status} />
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">配送時間</p>
                  <p className="text-[#666666]">{deliveryItem.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">配送先住所</p>
                  <p className="text-[#666666]">{deliveryItem.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">担当者</p>
                  <p className="text-[#666666]">{deliveryItem.contactPerson}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">連絡先</p>
                  <p className="text-[#666666]">{deliveryItem.phone}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#1C3D5A] p-0 h-auto mt-1"
                    onClick={() => alert(`${deliveryItem.phone}に電話をかけます`)}
                  >
                    電話をかける
                  </Button>
                </div>
              </div>

              <div className="flex items-start">
                <Truck className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">使用車両</p>
                  <p className="text-[#666666]">{deliveryItem.vehicle}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* タブ切り替え */}
        <Tabs defaultValue="info" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 h-12 mb-4">
            <TabsTrigger value="info" className="text-base">
              荷物情報
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base">
              配送履歴
            </TabsTrigger>
            <TabsTrigger value="map" className="text-base">
              地図
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4">荷物情報</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-[#1C3D5A] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">荷物</p>
                      <p className="text-[#666666]">{deliveryItem.items}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-bold">重量</p>
                      <p className="text-[#666666]">{deliveryItem.weight}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-bold mb-2">備考</h3>
                <p className="text-[#666666]">{deliveryItem.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4">配送履歴</h3>

                <div className="relative pl-6 border-l border-gray-200">
                  {deliveryItem.history.map((event, index) => (
                    <div key={index} className="mb-4 relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white border-2 border-[#1C3D5A]"></div>
                      <p className="text-sm text-gray-500">{event.time}</p>
                      <p className="font-medium">{event.action}</p>
                      <p className="text-[#666666]">{event.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 relative">
                  {/* 実際のアプリではGoogle Mapsなどを表示 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">地図が表示されます</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold mb-1">{deliveryItem.address}</p>
                  <Button className="w-full bg-white border border-[#F6C238] text-[#1C3D5A] hover:bg-gray-50">
                    ナビを開く
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* アクションボタン */}
        <div className="space-y-3">
          {deliveryItem.status !== "完了" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full h-14 text-lg bg-white border-2 border-[#1C3D5A] text-[#1C3D5A] hover:bg-gray-50">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  配送完了
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>配送完了の確認</DialogTitle>
                  <DialogDescription>配送が完了したことを記録します。備考があれば入力してください。</DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="備考（任意）"
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                />
                <DialogFooter>
                  <Button
                    className="bg-white border border-[#1C3D5A] text-[#1C3D5A] hover:bg-gray-50"
                    onClick={handleComplete}
                  >
                    完了を記録する
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {deliveryItem.status !== "完了" && deliveryItem.status !== "遅延" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full h-12 text-base bg-white border border-amber-500 text-amber-600 hover:bg-amber-50">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  遅延を報告
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>遅延の報告</DialogTitle>
                  <DialogDescription>配送の遅延を報告します。理由を選択してください。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleDelay("交通渋滞のため遅延")}
                  >
                    交通渋滞
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleDelay("車両トラブルのため遅延")}
                  >
                    車両トラブル
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleDelay("天候不良のため遅延")}
                  >
                    天候不良
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleDelay("その他の理由で遅延")}
                  >
                    その他
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button
            className="w-full h-12 bg-white border border-[#F6C238] text-[#1C3D5A] hover:bg-gray-50"
            onClick={() => alert("地図を表示します")}
          >
            <MapPin className="mr-2 h-5 w-5" />
            地図を見る
          </Button>
        </div>
      </main>

      <FooterNav />
    </div>
  )
}

