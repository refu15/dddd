"use client"

import { useState } from "react"
import { Clock, MapPin, Package, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { cn } from "@/lib/utils"

interface DeliveryItem {
  id: string
  time: string
  address: string
  customer: string
  status: string
  items: string
  contactPerson?: string
  phone?: string
  notes?: string
}

interface DeliveryCardProps {
  item: DeliveryItem
  className?: string
}

export function DeliveryCard({ item, className }: DeliveryCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className={cn(
        "mb-4 overflow-hidden transition-all duration-300",
        expanded ? "shadow-md" : "shadow-sm",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-[#1C3D5A] mr-2" />
            <span className="font-bold">{item.time}</span>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <h3 className="font-bold mb-1">{item.customer}</h3>
        <div className="flex items-start mb-2">
          <MapPin className="h-4 w-4 text-[#666666] mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-[#666666]">{item.address}</p>
        </div>
        <div className="flex items-center mb-2">
          <Package className="h-4 w-4 text-[#666666] mr-2" />
          <p className="text-sm text-[#666666]">{item.items}</p>
        </div>

        {/* 展開可能な追加情報 */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            {item.contactPerson && (
              <div className="mb-2">
                <p className="text-sm font-medium">担当者</p>
                <p className="text-sm text-[#666666]">{item.contactPerson}</p>
              </div>
            )}

            {item.phone && (
              <div className="mb-2">
                <p className="text-sm font-medium">連絡先</p>
                <p className="text-sm text-[#666666]">{item.phone}</p>
              </div>
            )}

            {item.notes && (
              <div className="mb-2">
                <p className="text-sm font-medium">備考</p>
                <p className="text-sm text-[#666666]">{item.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#666666] hover:text-[#1C3D5A] p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>閉じる</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>詳細</span>
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-[#1C3D5A] border-[#1C3D5A]"
              onClick={() => (window.location.href = `/delivery/${item.id}`)}
            >
              詳細ページ
            </Button>
            <Button size="sm" className="bg-white border border-[#F6C238] text-[#1C3D5A] hover:bg-gray-50">
              地図を見る
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

