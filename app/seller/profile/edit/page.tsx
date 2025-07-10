'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SellerProfile {
  id: string;
  company_name: string;
  contact_person?: string;
  phone_number?: string;
  email: string;
  address?: string;
  bank_account_details?: string;
}

export default function EditSellerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bankAccountDetails, setBankAccountDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const fetchSellerProfile = async () => {
        try {
          const response = await fetch('/api/sellers');
          if (!response.ok) {
            throw new Error('Failed to fetch seller profile');
          }
          const data: SellerProfile = await response.json();
          setCompanyName(data.company_name);
          setContactPerson(data.contact_person || '');
          setPhoneNumber(data.phone_number || '');
          setEmail(data.email);
          setAddress(data.address || '');
          setBankAccountDetails(data.bank_account_details || '');
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSellerProfile();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/sellers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactPerson,
          phone_number: phoneNumber,
          email: email,
          address: address,
          bank_account_details: bankAccountDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '販売者情報の更新に失敗しました。');
      }

      setMessage('販売者情報が正常に更新されました。');
      router.push('/seller/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>販売者情報編集</CardTitle>
          <CardDescription>販売者情報を編集してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">会社名</Label>
              <Input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">担当者名</Label>
              <Input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled // Email should be from authenticated user and not editable
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountDetails">銀行口座情報</Label>
              <Textarea
                id="bankAccountDetails"
                value={bankAccountDetails}
                onChange={(e) => setBankAccountDetails(e.target.value)}
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '更新中...' : '更新'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
