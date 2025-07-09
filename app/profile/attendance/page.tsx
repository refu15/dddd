import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

// 勤怠タイプをフォーマットするヘルパー関数
const formatAttendanceType = (type: string) => {
  switch (type) {
    case 'check_in':
      return <Badge variant="default">出勤</Badge>;
    case 'check_out':
      return <Badge variant="secondary">退勤</Badge>;
    case 'direct_go':
      return <Badge variant="outline">直行申請</Badge>;
    case 'direct_return':
      return <Badge variant="outline">直帰申請</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

// 承認ステータスをフォーマットするヘルパー関数
const formatApprovalStatus = (status: string | null) => {
  if (!status) return 'N/A';
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">保留中</Badge>;
    case 'approved':
      return <Badge variant="default">承認済み</Badge>;
    case 'rejected':
      return <Badge variant="destructive">却下</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function AttendanceLogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const supabase = createSupabaseServerClient();
  const { data: attendances, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', session.user.id)
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error("Error fetching attendance logs:", error);
    // ユーザーにエラーメッセージを表示することもできます
  }

  return (
    <div>
      <Header title="勤怠ログ" showBackButton backUrl="/profile" />
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>あなたの勤怠ログ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>備考</TableHead>
                  <TableHead>承認ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances && attendances.length > 0 ? (
                  attendances.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.recorded_at).toLocaleString('ja-JP')}</TableCell>
                      <TableCell>{formatAttendanceType(log.attendance_type)}</TableCell>
                      <TableCell>{log.notes || 'N/A'}</TableCell>
                      <TableCell>{formatApprovalStatus(log.approval_status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      勤怠ログがありません。
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
