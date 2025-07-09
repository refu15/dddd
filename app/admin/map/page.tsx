import { Header } from "@/app/components/header";
import { MapDisplay } from "@/app/components/map-display"; // 次に作成します

export default async function MapPage() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div>
        <Header title="位置情報マップ" showBackButton backUrl="/admin" />
        <main className="container mx-auto p-4">
          <div className="text-center text-red-500">
            Google Maps APIキーが設定されていません。
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="位置情報マップ" showBackButton backUrl="/admin" />
      <main className="container mx-auto p-4 h-[calc(100vh-120px)]"> {/* 必要に応じて高さを調整 */}
        <MapDisplay apiKey={googleMapsApiKey} />
      </main>
    </div>
  );
}
