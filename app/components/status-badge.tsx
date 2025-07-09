import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let badgeStyle = ""

  switch (status) {
    case "配送中":
      badgeStyle = "bg-white border border-green-500 text-green-600"
      break
    case "未着手":
      badgeStyle = "bg-white border border-[#1C3D5A] text-[#1C3D5A]"
      break
    case "完了":
      badgeStyle = "bg-white border border-gray-400 text-gray-600"
      break
    case "休憩":
      badgeStyle = "bg-white border border-[#F6C238] text-[#1C3D5A]"
      break
    case "シフト":
      badgeStyle = "bg-white border border-[#F6C238] text-[#1C3D5A]"
      break
    case "出勤":
      badgeStyle = "bg-white border border-[#1C3D5A] text-[#1C3D5A]"
      break
    case "退勤":
      badgeStyle = "bg-white border border-[#1C3D5A] text-[#1C3D5A]"
      break
    case "遅延":
      badgeStyle = "bg-white border border-red-500 text-red-600"
      break
    default:
      badgeStyle = "bg-white border border-[#1C3D5A] text-[#1C3D5A]"
  }

  return <Badge className={cn(badgeStyle, className)}>{status}</Badge>
}

