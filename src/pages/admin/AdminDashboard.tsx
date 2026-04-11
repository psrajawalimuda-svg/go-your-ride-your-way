import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Car, MapPin, DollarSign, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminUsers, useAdminDrivers, useAdminTrips, useAdminTransactions } from "@/hooks/use-admin-data";
import { useDashboardCharts, useRecentActivity } from "@/hooks/use-app-data";

const activityTypeColor: Record<string, string> = {
  trip: "bg-emerald-500/10 text-emerald-600",
  payment: "bg-amber-500/10 text-amber-600",
  driver: "bg-blue-500/10 text-blue-600",
  booking: "bg-purple-500/10 text-purple-600",
  promo: "bg-pink-500/10 text-pink-600",
};

export default function AdminDashboard() {
  const { data: users, isLoading: loadingUsers } = useAdminUsers();
  const { data: drivers, isLoading: loadingDrivers } = useAdminDrivers();
  const { data: trips, isLoading: loadingTrips } = useAdminTrips();
  const { data: transactions, isLoading: loadingTxn } = useAdminTransactions();
  const { data: charts, isLoading: loadingCharts } = useDashboardCharts();
  const { data: activities, isLoading: loadingActivity } = useRecentActivity();

  const isLoading = loadingUsers || loadingDrivers || loadingTrips || loadingTxn;

  const today = new Date().toISOString().slice(0, 10);
  const kpiCards = [
    { label: "Total Users", value: users?.length ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Active Drivers", value: drivers?.filter(d => d.status !== "offline").length ?? 0, icon: Car, color: "text-emerald-500" },
    { label: "Today's Trips", value: trips?.filter(t => t.created_at.startsWith(today)).length ?? 0, icon: MapPin, color: "text-amber-500" },
    { label: "Revenue", value: `Rp ${((transactions?.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0) ?? 0) / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-primary" },
    { label: "Pending Payments", value: transactions?.filter(t => t.status === "pending" || t.status === "processing").length ?? 0, icon: Clock, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold text-foreground">{kpi.value}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Trips (7 Days)</CardTitle></CardHeader>
            <CardContent>
              {loadingCharts ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={charts?.tripsChartData || []}>
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue (7 Days)</CardTitle></CardHeader>
            <CardContent>
              {loadingCharts ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={charts?.revenueChartData || []}>
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Aktivitas Terbaru</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loadingActivity ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (activities || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
            ) : (
              (activities || []).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <Badge variant="secondary" className={`text-[10px] shrink-0 ${activityTypeColor[a.type] || ""}`}>{a.type}</Badge>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
