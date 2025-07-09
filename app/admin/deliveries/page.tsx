import { Header } from "@/app/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DeleteDeliveryButton } from "./DeleteDeliveryButton";
import { UpdateInvoiceStatusButton } from "./UpdateInvoiceStatusButton";

// 日付を日本のロケールに合わせてフォーマットするヘルパー関数
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("ja-JP");
};

// 案件ステータスに応じてバッジのスタイルを変更するヘルパー関数
const formatDeliveryStatus = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">保留中</Badge>;
    case "in_progress":
      return <Badge variant="default">進行中</Badge>;
    case "completed":
      return <Badge variant="success">完了</Badge>; // success variant が存在するか、追加可能と仮定
    case "cancelled":
      return <Badge variant="destructive">キャンセル</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// 請求ステータスに応じてバッジのスタイルを変更するヘルパー関数
const formatInvoiceStatus = (status: string) => {
  switch (status) {
    case "unbilled":
      return <Badge variant="secondary">未請求</Badge>;
    case "billed":
      return <Badge variant="default">請求済み</Badge>;
    case "paid":
      return <Badge variant="success">入金済み</Badge>; // success variant が存在するか、追加可能と仮定
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function DeliveriesPage() {
  const supabase = createSupabaseServerClient();
  const { data: deliveries, error } = await supabase
    .from("deliveries")
    .select(
      `
      *,
      users(name),
      vehicles(name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deliveries:", error);
    // ここでユーザーにエラーメッセージを表示することもできます
  }

  return (
    <div>
      <Header title="案件管理" showBackButton backUrl="/admin" />
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>案件一覧</CardTitle>
              <Link href="/admin/deliveries/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  案件を追加
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>案件名</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>担当ドライバー</TableHead>
                  <TableHead>合計料金</TableHead>
                  <TableHead>請求ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries && deliveries.length > 0 ? (
                  deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.title}</TableCell>
                      <TableCell>{delivery.customer_name}</TableCell>
                      <TableCell>{formatDeliveryStatus(delivery.status)}</TableCell>
                      <TableCell>{delivery.users?.name || "未割当"}</TableCell>
                      <TableCell>¥{delivery.total_charge?.toLocaleString()}</TableCell>
                      <TableCell>{formatInvoiceStatus(delivery.invoice_status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/deliveries/${delivery.id}`}>詳細</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/deliveries/${delivery.id}/edit`}>編集</Link>
                            </DropdownMenuItem>
                            <UpdateInvoiceStatusButton deliveryId={delivery.id} currentStatus={delivery.invoice_status} />
                            <DeleteDeliveryButton deliveryId={delivery.id} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      案件データがありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
