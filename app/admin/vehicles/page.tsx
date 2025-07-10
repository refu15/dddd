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
import { DeleteVehicleButton } from "./DeleteVehicleButton";

// 日付を日本のロケールに合わせてフォーマットするヘルパー関数
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("ja-JP");
};

// ステータスに応じてバッジのスタイルを変更するヘルパー関数
const formatStatus = (status: string) => {
  switch (status) {
    case "available":
      return <Badge variant="default">空き</Badge>;
    case "in_use":
      return <Badge variant="secondary">運行中</Badge>;
    case "maintenance":
      return <Badge variant="destructive">整備中</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function VehiclesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vehicles:", error);
    // ここでユーザーにエラーメッセージを表示することもできます
  }

  return (
    <div>
      <Header title="車両管理" showBackButton backUrl="/admin" />
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>車両一覧</CardTitle>
              <Link href="/admin/vehicles/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  車両を追加
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>車両名</TableHead>
                  <TableHead>ナンバープレート</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>車検満了日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles && vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.name}</TableCell>
                      <TableCell>{vehicle.license_plate}</TableCell>
                      <TableCell>{formatStatus(vehicle.status)}</TableCell>
                      <TableCell>{formatDate(vehicle.inspection_due_date)}</TableCell>
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
                              <Link href={`/admin/vehicles/${vehicle.id}/edit`}>編集</Link>
                            </DropdownMenuItem>
                            <DeleteVehicleButton vehicleId={vehicle.id} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      車両データがありません。
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
