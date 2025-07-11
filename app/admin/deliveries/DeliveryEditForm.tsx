'use client';

import { DeliveryForm } from "@/app/admin/deliveries/DeliveryForm";
import { updateDelivery } from "@/app/admin/deliveries/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliveryEditFormProps {
  deliveryId: string;
  initialData: any; // Replace 'any' with actual type if available
}

export function DeliveryEditForm({ deliveryId, initialData }: DeliveryEditFormProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>案件情報の編集</CardTitle>
      </CardHeader>
      <CardContent>
        <DeliveryForm
          action={updateDelivery.bind(null, deliveryId)}
          initialData={initialData}
          submitButtonText="変更を保存"
        />
      </CardContent>
    </Card>
  );
}
