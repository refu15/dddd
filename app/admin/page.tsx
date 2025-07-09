import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <Header title="管理者ページ" showBackButton />
      <main className="container mx-auto p-4">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">管理者専用ダッシュボード</h1>
            <p>このページは管理者権限を持つユーザーのみがアクセスできます。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/vehicles" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    車両管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">車両の登録、編集、削除を行います。</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/map" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    位置情報マップ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">ドライバーの現在位置を地図で確認します。</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/deliveries" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    案件管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">配送案件の登録、編集、請求管理を行います。</p>
                </CardContent>
              </Card>
            </Link>
            {/* 他の管理機能へのリンクをここに追加できます */}
          </div>
        </div>
      </main>
    </div>
  );
}
