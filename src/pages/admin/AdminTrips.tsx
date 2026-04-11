import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTrips } from "@/lib/mock-admin-data";
import type { TripStatus } from "@/types/models";

const statusColor: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600",
  on_trip: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-destructive/10 text-destructive",
  searching: "bg-amber-500/10 text-amber-600",
  arriving: "bg-purple-500/10 text-purple-600",
};

export default function AdminTrips() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = statusFilter === "all" ? mockTrips : mockTrips.filter((t) => t.status === statusFilter);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-foreground">Trip Management</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_trip">On Trip</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Penumpang</TableHead>
                  <TableHead className="hidden md:table-cell">Driver</TableHead>
                  <TableHead className="hidden lg:table-cell">Pickup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-medium">{t.passengerName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{t.driverName}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[150px] truncate">{t.pickup}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs ${statusColor[t.status] || ""}`}>{t.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">Rp {t.fare.toLocaleString()}</TableCell>
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
