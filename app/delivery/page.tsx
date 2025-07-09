"use client"

import { useState } from "react"
import { Search, Filter, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Header } from "../components/header"
import { FooterNav } from "../components/footer-nav"
import { DeliveryCard } from "../components/delivery-card"

export default function DeliveryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState(deliveryItems)

  // 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredItems(deliveryItems)
      return
    }

    const filtered = deliveryItems.filter(
      (item) =>
        item.customer.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredItems(filtered)
  }

  // フィルター適用
  const applyFilters = (status?: string, area?: string) => {
    let filtered = [...deliveryItems]

    if (status && status !== "all") {
      filtered = filtered.filter((item) => item.status === status)
    }

    if (area && area !== "all") {
      filtered = filtered.filter((item) => item.address.includes(area))
    }

    setFilteredItems(filtered)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="配送案件" showBackButton={true} backUrl="/" />

      <main className="container mx-auto p-4">
        {/* 検索バーとフィルター */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#666666]" />
            <Input
              placeholder="案件を検索"
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>フィルター</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ステータス</label>
                  <Select onValueChange={(value) => applyFilters(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="配送中">配送中</SelectItem>
                      <SelectItem value="未着手">未着手</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">エリア</label>
                  <Select onValueChange={(value) => applyFilters(undefined, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="すべてのエリア" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのエリア</SelectItem>
                      <SelectItem value="新宿">新宿</SelectItem>
                      <SelectItem value="渋谷">渋谷</SelectItem>
                      <SelectItem value="港区">港区</SelectItem>
                      <SelectItem value="千代田区">千代田区</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">日付</label>
                  <Input type="date" />
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-white border-2 border-[#1C3D5A] text-[#1C3D5A] hover:bg-gray-50"
                    onClick={() => setFilteredItems(deliveryItems)}
                  >
                    フィルターをリセット
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* タブ切り替え */}
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="all" className="text-base">
              全て
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="text-base">
              進行中
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-base">
              未着手
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => <DeliveryCard key={index} item={item} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>該当する案件がありません</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-4 space-y-4">
            {filteredItems
              .filter((item) => item.status === "配送中")
              .map((item, index) => (
                <DeliveryCard key={index} item={item} />
              ))}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {filteredItems
              .filter((item) => item.status === "未着手")
              .map((item, index) => (
                <DeliveryCard key={index} item={item} />
              ))}
          </TabsContent>
        </Tabs>
      </main>

      <FooterNav />
    </div>
  )
}

// 配送案件データ
const deliveryItems = [
  {
    id: "DEL001",
    time: "09:30 - 10:30",
    address: "東京都新宿区西新宿1-1-1",
    customer: "株式会社ABC",
    status: "配送中",
    items: "段ボール 3箱",
    contactPerson: "田中太郎",
    phone: "03-1234-5678",
    notes: "受付で名前を伝えてください",
  },
  {
    id: "DEL002",
    time: "11:00 - 12:00",
    address: "東京都渋谷区渋谷2-2-2",
    customer: "株式会社DEF",
    status: "未着手",
    items: "段ボール 1箱",
    contactPerson: "佐藤花子",
    phone: "03-2345-6789",
  },
  {
    id: "DEL003",
    time: "14:00 - 15:00",
    address: "東京都港区六本木3-3-3",
    customer: "株式会社GHI",
    status: "未着手",
    items: "段ボール 5箱",
    contactPerson: "鈴木一郎",
    phone: "03-3456-7890",
    notes: "駐車場は建物裏にあります",
  },
  {
    id: "DEL004",
    time: "16:00 - 17:00",
    address: "東京都千代田区丸の内4-4-4",
    customer: "株式会社JKL",
    status: "未着手",
    items: "段ボール 2箱",
    contactPerson: "高橋次郎",
    phone: "03-4567-8901",
  },
  {
    id: "DEL005",
    time: "13:00 - 14:00",
    address: "東京都新宿区四谷5-5-5",
    customer: "株式会社MNO",
    status: "完了",
    items: "段ボール 4箱",
    contactPerson: "伊藤三郎",
    phone: "03-5678-9012",
    notes: "配送完了済み",
  },
]

