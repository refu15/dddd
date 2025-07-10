'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SellerProfile {
  id: string;
  company_name: string;
  contact_person?: string;
  phone_number?: string;
  email: string;
  address?: string;
  bank_account_details?: string;
}

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      const fetchSellerProfile = async () => {
        try {
          const response = await fetch('/api/sellers');
          if (!response.ok) {
            if (response.status === 404) {
              // Seller profile not found, prompt to create one
              setError('販売者情報が登録されていません。登録してください。');
              setLoading(false);
              return;
            }
            throw new Error('Failed to fetch seller profile');
          }
          const data = await response.json();
          setSellerProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSellerProfile();
    }
  }, [status, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error && error !== '販売者情報が登録されていません。登録してください。') {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">販売者ダッシュボード</h1>

      {error === '販売者情報が登録されていません。登録してください。' ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>販売者情報がありません</CardTitle>
            <CardDescription>商品登録を行う前に、販売者情報を登録してください。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/seller/profile/new">
              <Button>販売者情報を登録</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>販売者情報</CardTitle>
            <CardDescription>登録済みの販売者情報です。</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>会社名:</strong> {sellerProfile?.company_name}</p>
            <p><strong>担当者:</strong> {sellerProfile?.contact_person}</p>
            <p><strong>電話番号:</strong> {sellerProfile?.phone_number}</p>
            <p><strong>メール:</strong> {sellerProfile?.email}</p>
            <p><strong>住所:</strong> {sellerProfile?.address}</p>
            <p><strong>銀行口座:</strong> {sellerProfile?.bank_account_details}</p>
            <div className="mt-4">
              <Link href="/seller/profile/edit">
                <Button>販売者情報を編集</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>商品管理</CardTitle>
          <CardDescription>登録済みの商品を管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/seller/products">
            <Button>商品一覧を見る</Button>
          </Link>
          <Link href="/seller/products/new" className="ml-4">
            <Button>新しい商品を登録</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
