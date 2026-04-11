import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminShuttleSchedules, useAdminShuttleBookings } from "@/hooks/use-admin-data";

const bookingStatusColor: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  completed: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminShuttle() {
  const { data: schedules, isLoading: loadingSchedules } = useAdminShuttleSchedules();
  const { data: bookings, isLoading: loadingBookings } = useAdminShuttleBookings();

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Shuttle Management</h2>

        <Tabs defaultValue="schedules">
          <TabsList>
            <TabsTrigger value="schedules">Jadwal</TabsTrigger>
            <TabsTrigger value="bookings">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loadingSchedules ? (
                  <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rute</TableHead>
                        <TableHead>Berangkat</TableHead>
                        <TableHead className="hidden md:table-cell">Durasi</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Kursi</TableHead>
                        <TableHead className="hidden md:table-cell">Operator</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(schedules ?? []).map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.from_city} → {s.to_city}</TableCell>
                          <TableCell>{s.departure}</TableCell>
                          <TableCell className="hidden md:table-cell">{s.duration}</TableCell>
                          <TableCell>Rp {s.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={s.available_seats <= 5 ? "text-destructive font-medium" : ""}>
                              {s.available_seats}/{s.total_seats}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{s.operator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loadingBookings ? (
                  <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Penumpang</TableHead>
                        <TableHead>Rute</TableHead>
                        <TableHead className="hidden md:table-cell">Kursi</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(bookings ?? []).map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-xs">{b.id}</TableCell>
                          <TableCell className="font-medium">{b.passenger_name}</TableCell>
                          <TableCell className="text-sm">{b.route}</TableCell>
                          <TableCell className="hidden md:table-cell">{b.seats}</TableCell>
                          <TableCell>Rp {b.total_price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${bookingStatusColor[b.status] || ""}`}>{b.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
