import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, MapPin, DollarSign, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { dashboardKPIs, tripsChartData, revenueChartData, recentActivity } from "@/lib/mock-admin-data";
import { AdminLayout } from "@/components/admin/AdminLayout";

const kpiCards = [
  { label: "Total Users", value: dashboardKPIs.totalUsers, icon: Users, color: "text-blue-500" },
  { label: "Active Drivers", value: dashboardKPIs.activeDrivers, icon: Car, color: "text-emerald-500" },
  { label: "Today's Trips", value: dashboardKPIs.todaysTrips, icon: MapPin, color: "text-amber-500" },
  { label: "Revenue", value: `Rp ${(dashboardKPIs.totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-primary" },
  { label: "Pending Payments", value: dashboardKPIs.pendingPayments, icon: Clock, color: "text-orange-500" },
];

const activityTypeColor: Record<string, string> = {
  trip: "bg-emerald-500/10 text-emerald-600",
  payment: "bg-amber-500/10 text-amber-600",
  driver: "bg-blue-500/10 text-blue-600",
  booking: "bg-purple-500/10 text-purple-600",
  promo: "bg-pink-500/10 text-pink-600",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trips (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tripsChartData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueChartData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${activityTypeColor[a.type]}`}>
                  {a.type}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
