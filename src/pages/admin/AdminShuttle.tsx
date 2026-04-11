import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockShuttleSchedules, mockShuttleBookings } from "@/lib/mock-admin-data";

const bookingStatusColor: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  completed: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminShuttle() {
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
                    {mockShuttleSchedules.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.from} → {s.to}</TableCell>
                        <TableCell>{s.departure}</TableCell>
                        <TableCell className="hidden md:table-cell">{s.duration}</TableCell>
                        <TableCell>Rp {s.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={s.availableSeats <= 5 ? "text-destructive font-medium" : ""}>
                            {s.availableSeats}/{s.totalSeats}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.operator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardContent className="p-0">
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
                    {mockShuttleBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell className="font-medium">{b.passengerName}</TableCell>
                        <TableCell className="text-sm">{b.route}</TableCell>
                        <TableCell className="hidden md:table-cell">{b.seats}</TableCell>
                        <TableCell>Rp {b.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${bookingStatusColor[b.status] || ""}`}>{b.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
