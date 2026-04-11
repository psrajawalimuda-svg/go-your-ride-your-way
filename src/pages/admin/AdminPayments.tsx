import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTransactions } from "@/lib/mock-admin-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusColor: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-blue-500/10 text-blue-600",
  failed: "bg-destructive/10 text-destructive",
};

const methodBreakdown = mockTransactions
  .filter((t) => t.status === "success")
  .reduce<Record<string, number>>((acc, t) => {
    acc[t.method] = (acc[t.method] || 0) + t.amount;
    return acc;
  }, {});

const pieData = Object.entries(methodBreakdown).map(([name, value]) => ({ name, value }));
const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6"];

const totalRevenue = mockTransactions.filter((t) => t.status === "success").reduce((s, t) => s + t.amount, 0);

export default function AdminPayments() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Payment Management</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">Rp {totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">{mockTransactions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2 text-center">By Method</p>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={20}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
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
                {mockTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="text-sm">{t.description}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{t.method}</Badge></TableCell>
                    <TableCell className="font-medium">Rp {t.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs ${statusColor[t.status] || ""}`}>{t.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
