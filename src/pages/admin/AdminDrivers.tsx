import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDrivers } from "@/lib/mock-admin-data";
import { Search, Star } from "lucide-react";

const statusColor: Record<string, string> = {
  online: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  busy: "bg-amber-500/10 text-amber-600 border-amber-200",
  offline: "bg-muted text-muted-foreground",
};

export default function AdminDrivers() {
  const [search, setSearch] = useState("");
  const filtered = mockDrivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.vehiclePlate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Driver Management</h2>
          <Badge variant="secondary">{mockDrivers.length} drivers</Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama atau plat..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Rating</TableHead>
                  <TableHead className="hidden md:table-cell">Trips</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.vehiclePlate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{d.vehicleModel}</p>
                        <Badge variant="outline" className="text-[10px]">{d.vehicleClass}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColor[d.status]}`}>{d.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {d.rating}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{d.totalTrips}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {d.approved ? "Suspend" : "Approve"}
                      </Button>
                    </TableCell>
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
