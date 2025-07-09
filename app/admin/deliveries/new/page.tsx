import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDelivery } from "../actions";
import { DeliveryForm } from "../DeliveryForm";

export default function NewDeliveryPage() {
  return (
    <div>
      <Header title="案件の追加" showBackButton backUrl="/admin/deliveries" />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>新規案件登録</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryForm 
              action={addDelivery}
              submitButtonText="案件を登録"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
