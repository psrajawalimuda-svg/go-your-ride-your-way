import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminTransactions } from "@/hooks/use-admin-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusColor: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-blue-500/10 text-blue-600",
  failed: "bg-destructive/10 text-destructive",
};

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6"];

export default function AdminPayments() {
  const { data: transactions, isLoading } = useAdminTransactions();

  const successTxn = (transactions ?? []).filter((t) => t.status === "success");
  const totalRevenue = successTxn.reduce((s, t) => s + t.amount, 0);

  const methodBreakdown = successTxn.reduce<Record<string, number>>((acc, t) => {
    acc[t.method] = (acc[t.method] || 0) + t.amount;
    return acc;
  }, {});
  const pieData = Object.entries(methodBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Payment Management</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              {isLoading ? <Skeleton className="h-8 w-24 mx-auto" /> : <p className="text-2xl font-bold text-foreground">Rp {totalRevenue.toLocaleString()}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : <p className="text-2xl font-bold text-foreground">{transactions?.length ?? 0}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2 text-center">By Method</p>
              {isLoading ? <Skeleton className="h-[100px] w-full" /> : (
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={20}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(transactions ?? []).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="text-sm">{t.description}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{t.method}</Badge></TableCell>
                      <TableCell className="font-medium">Rp {t.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs ${statusColor[t.status] || ""}`}>{t.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
