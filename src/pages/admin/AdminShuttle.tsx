import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  useShuttleRoutes,
  useAllShuttlePickupPoints,
  useShuttleVehicleClasses,
  useShuttleDepartures,
  useAdminShuttleBookings,
  useUpdateVehicleClass,
  useUpsertPickupPoint,
  useDeletePickupPoint,
  useUpsertDeparture,
  useDeleteDeparture,
} from "@/hooks/use-admin-data";
import {
  MapPin, ChevronDown, ChevronRight, Bus, Car, Crown, Clock,
  Users, Package, Plus, Pencil, Trash2,
} from "lucide-react";
import { toast } from "sonner";

const bookingStatusColor: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  completed: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-destructive/10 text-destructive",
};

const classIcons: Record<string, React.ElementType> = {
  Reguler: Bus,
  "Semi Executive": Car,
  Executive: Crown,
};

function SeatLayoutVisual({ layout, vehicleType }: { layout: any; vehicleType: string }) {
  if (!layout?.rows) return <span className="text-xs text-muted-foreground">N/A</span>;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground mb-1">{vehicleType} ({layout.total_seats} kursi)</p>
      <div className="inline-flex flex-col gap-1 bg-secondary/50 p-2 rounded-lg">
        {(layout.rows as any[]).map((row: any[], ri: number) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map((seat: any, si: number) => {
              const isDriver = seat === "driver";
              const isBagasi = seat === "bagasi";
              return (
                <div key={si} className={`w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center ${isDriver ? "bg-muted text-muted-foreground border border-border" : isBagasi ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-300 dark:border-amber-700" : "bg-primary/10 text-primary border border-primary/20"}`}>
                  {isDriver ? "D" : isBagasi ? "B" : seat}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pickup Point Form Dialog ──────────────────────────────────────────────

interface PickupPointForm {
  id?: string;
  route_id: string;
  sequence: number;
  name: string;
  pickup_time: string;
  distance_m: number;
}

function PickupPointDialog({
  open, onOpenChange, initial, routeId, maxSeq,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: PickupPointForm;
  routeId: string;
  maxSeq: number;
}) {
  const upsert = useUpsertPickupPoint();
  const [form, setForm] = useState<PickupPointForm>(
    initial ?? { route_id: routeId, sequence: maxSeq + 1, name: "", pickup_time: "06:00", distance_m: 0 }
  );

  const isEdit = !!initial?.id;

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nama titik jemput wajib diisi"); return; }
    upsert.mutate(
      { ...form, route_id: routeId },
      {
        onSuccess: () => { toast.success(isEdit ? "Titik jemput diupdate" : "Titik jemput ditambahkan"); onOpenChange(false); },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  // Reset form when dialog opens
  const handleOpenChange = (o: boolean) => {
    if (o) {
      setForm(initial ?? { route_id: routeId, sequence: maxSeq + 1, name: "", pickup_time: "06:00", distance_m: 0 });
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Titik Jemput" : "Tambah Titik Jemput"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Urutan (Sequence)</Label>
            <Input type="number" value={form.sequence} onChange={(e) => setForm((f) => ({ ...f, sequence: parseInt(e.target.value) || 1 }))} />
          </div>
          <div>
            <Label className="text-xs">Nama Lokasi</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contoh: Grand Hotel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Waktu Jemput (WIB)</Label>
              <Input value={form.pickup_time} onChange={(e) => setForm((f) => ({ ...f, pickup_time: e.target.value }))} placeholder="06:00" />
            </div>
            <div>
              <Label className="text-xs">Jarak (meter)</Label>
              <Input type="number" value={form.distance_m} onChange={(e) => setForm((f) => ({ ...f, distance_m: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={upsert.isPending}>{upsert.isPending ? "Menyimpan..." : "Simpan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Departure Form Dialog ─────────────────────────────────────────────────

interface DepartureForm {
  id?: string;
  batch_label: string;
  departure_time: string;
  arrival_time: string;
  route_id: string;
  driver_count: number;
  active: boolean;
}

function DepartureDialog({
  open, onOpenChange, initial, routes,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: DepartureForm;
  routes: { id: string; code: string; name: string }[];
}) {
  const upsert = useUpsertDeparture();
  const defaultForm: DepartureForm = {
    batch_label: "", departure_time: "06:00", arrival_time: "08:00",
    route_id: routes[0]?.id ?? "", driver_count: 3, active: true,
  };
  const [form, setForm] = useState<DepartureForm>(initial ?? defaultForm);
  const isEdit = !!initial?.id;

  const handleOpenChange = (o: boolean) => {
    if (o) setForm(initial ?? defaultForm);
    onOpenChange(o);
  };

  const handleSave = () => {
    if (!form.batch_label.trim()) { toast.error("Label batch wajib diisi"); return; }
    if (!form.route_id) { toast.error("Pilih rayon"); return; }
    upsert.mutate(form, {
      onSuccess: () => { toast.success(isEdit ? "Jadwal diupdate" : "Jadwal ditambahkan"); onOpenChange(false); },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Jadwal" : "Tambah Jadwal"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Label Batch</Label>
            <Input value={form.batch_label} onChange={(e) => setForm((f) => ({ ...f, batch_label: e.target.value }))} placeholder="Batch 5" />
          </div>
          <div>
            <Label className="text-xs">Rayon</Label>
            <Select value={form.route_id} onValueChange={(v) => setForm((f) => ({ ...f, route_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih rayon" /></SelectTrigger>
              <SelectContent>
                {routes.map((r) => <SelectItem key={r.id} value={r.id}>{r.code} – {r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Berangkat</Label>
              <Input value={form.departure_time} onChange={(e) => setForm((f) => ({ ...f, departure_time: e.target.value }))} placeholder="06:00" />
            </div>
            <div>
              <Label className="text-xs">Tiba</Label>
              <Input value={form.arrival_time} onChange={(e) => setForm((f) => ({ ...f, arrival_time: e.target.value }))} placeholder="08:00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Jumlah Driver</Label>
              <Input type="number" value={form.driver_count} onChange={(e) => setForm((f) => ({ ...f, driver_count: parseInt(e.target.value) || 1 }))} />
            </div>
            <div className="flex items-end">
              <Button type="button" variant={form.active ? "default" : "secondary"} className="w-full" onClick={() => setForm((f) => ({ ...f, active: !f.active }))}>
                {form.active ? "Aktif" : "Nonaktif"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={upsert.isPending}>{upsert.isPending ? "Menyimpan..." : "Simpan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function AdminShuttle() {
  const { data: routes, isLoading: loadingRoutes } = useShuttleRoutes();
  const { data: allPoints, isLoading: loadingPoints } = useAllShuttlePickupPoints();
  const { data: vehicleClasses, isLoading: loadingClasses } = useShuttleVehicleClasses();
  const { data: departures, isLoading: loadingDepartures } = useShuttleDepartures();
  const { data: bookings, isLoading: loadingBookings } = useAdminShuttleBookings();
  const updateClass = useUpdateVehicleClass();
  const deletePoint = useDeletePickupPoint();
  const deleteDep = useDeleteDeparture();

  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<Record<string, string>>({});

  // Pickup point dialog state
  const [ppDialogOpen, setPpDialogOpen] = useState(false);
  const [ppDialogRouteId, setPpDialogRouteId] = useState("");
  const [ppDialogInitial, setPpDialogInitial] = useState<PickupPointForm | undefined>();

  // Departure dialog state
  const [depDialogOpen, setDepDialogOpen] = useState(false);
  const [depDialogInitial, setDepDialogInitial] = useState<DepartureForm | undefined>();

  const pointsByRoute = (routeId: string) =>
    (allPoints ?? []).filter((p) => p.route_id === routeId).sort((a, b) => a.sequence - b.sequence);

  const handleSavePrice = (id: string) => {
    const val = editingPrice[id];
    if (!val) return;
    updateClass.mutate(
      { id, price_per_km: parseInt(val) },
      { onSuccess: () => { toast.success("Harga berhasil diupdate"); setEditingPrice((p) => { const n = { ...p }; delete n[id]; return n; }); } }
    );
  };

  const openAddPoint = (routeId: string) => {
    const points = pointsByRoute(routeId);
    const maxSeq = points.length > 0 ? Math.max(...points.map((p) => p.sequence)) : 0;
    setPpDialogRouteId(routeId);
    setPpDialogInitial(undefined);
    setPpDialogOpen(true);
  };

  const openEditPoint = (point: any) => {
    setPpDialogRouteId(point.route_id);
    setPpDialogInitial({ id: point.id, route_id: point.route_id, sequence: point.sequence, name: point.name, pickup_time: point.pickup_time, distance_m: point.distance_m });
    setPpDialogOpen(true);
  };

  const handleDeletePoint = (id: string) => {
    deletePoint.mutate(id, {
      onSuccess: () => toast.success("Titik jemput dihapus"),
      onError: (e) => toast.error(e.message),
    });
  };

  const openAddDep = () => {
    setDepDialogInitial(undefined);
    setDepDialogOpen(true);
  };

  const openEditDep = (dep: any) => {
    setDepDialogInitial({ id: dep.id, batch_label: dep.batch_label, departure_time: dep.departure_time, arrival_time: dep.arrival_time, route_id: dep.route_id, driver_count: dep.driver_count, active: dep.active });
    setDepDialogOpen(true);
  };

  const handleDeleteDep = (id: string) => {
    deleteDep.mutate(id, {
      onSuccess: () => toast.success("Jadwal dihapus"),
      onError: (e) => toast.error(e.message),
    });
  };

  const loading = loadingRoutes || loadingPoints || loadingClasses || loadingDepartures;

  const maxSeqForRoute = (routeId: string) => {
    const pts = pointsByRoute(routeId);
    return pts.length > 0 ? Math.max(...pts.map((p) => p.sequence)) : 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Shuttle Management</h2>
          <Badge variant="outline" className="text-xs">Medan → Kualanamu</Badge>
        </div>

        <Tabs defaultValue="routes">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="routes">Rayon & Rute</TabsTrigger>
            <TabsTrigger value="classes">Kelas</TabsTrigger>
            <TabsTrigger value="departures">Jadwal</TabsTrigger>
            <TabsTrigger value="bookings">Booking</TabsTrigger>
          </TabsList>

          {/* ─── RAYON & RUTE ─────────────────────────────── */}
          <TabsContent value="routes" className="mt-4 space-y-3">
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : (
              (routes ?? []).map((route) => {
                const points = pointsByRoute(route.id);
                const isOpen = expandedRoute === route.id;
                return (
                  <Collapsible key={route.id} open={isOpen} onOpenChange={(o) => setExpandedRoute(o ? route.id : null)}>
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-sm">{route.name}</p>
                            <p className="text-xs text-muted-foreground">{route.from_city} → {route.to_city}</p>
                          </div>
                          <div className="text-right mr-2">
                            <p className="text-xs text-muted-foreground">{points.length} titik jemput</p>
                            <p className="text-xs font-mono">{(route.total_distance_m / 1000).toFixed(1)} km</p>
                          </div>
                          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t">
                          <div className="p-2 flex justify-end">
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openAddPoint(route.id)}>
                              <Plus className="h-3 w-3" /> Tambah Titik
                            </Button>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Titik Jemput</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead className="text-right">Jarak (m)</TableHead>
                                <TableHead className="w-20 text-center">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {points.map((p) => (
                                <TableRow key={p.id}>
                                  <TableCell className="font-mono text-xs text-muted-foreground">J{p.sequence}</TableCell>
                                  <TableCell className="font-medium text-sm">{p.name}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1 text-sm">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      {p.pickup_time}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-sm">{p.distance_m.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditPoint(p)}>
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus titik jemput?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Titik jemput "{p.name}" akan dihapus secara permanen.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeletePoint(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })
            )}
          </TabsContent>

          {/* ─── KELAS KENDARAAN ───────────────────────────── */}
          <TabsContent value="classes" className="mt-4">
            {loadingClasses ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
            ) : (
              <div className="grid gap-4">
                {(vehicleClasses ?? []).map((vc) => {
                  const Icon = classIcons[vc.name] ?? Bus;
                  const layouts = (vc.seating_layouts ?? {}) as Record<string, any>;
                  const rules = (vc.baggage_rules ?? []) as string[];
                  return (
                    <Card key={vc.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{vc.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Input type="number" className="w-24 h-7 text-xs" value={editingPrice[vc.id] ?? String(vc.price_per_km)} onChange={(e) => setEditingPrice((p) => ({ ...p, [vc.id]: e.target.value }))} />
                                <span className="text-xs text-muted-foreground">/km</span>
                              </div>
                              {editingPrice[vc.id] && editingPrice[vc.id] !== String(vc.price_per_km) && (
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSavePrice(vc.id)}>Simpan</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Package className="h-3 w-3" /> Ketentuan Bagasi</p>
                          <div className="flex flex-wrap gap-1">{rules.map((r, i) => <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>)}</div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Layout Kursi</p>
                          <div className="flex flex-wrap gap-4">
                            {Object.entries(layouts).map(([type, layout]) => <SeatLayoutVisual key={type} vehicleType={type} layout={layout} />)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── JADWAL KEBERANGKATAN ─────────────────────── */}
          <TabsContent value="departures" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="p-3 flex justify-end border-b">
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={openAddDep}>
                    <Plus className="h-3 w-3" /> Tambah Jadwal
                  </Button>
                </div>
                {loadingDepartures ? (
                  <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch</TableHead>
                        <TableHead>Rayon</TableHead>
                        <TableHead>Berangkat</TableHead>
                        <TableHead>Tiba</TableHead>
                        <TableHead className="text-center">Driver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20 text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(departures ?? []).map((dep) => {
                        const route = (routes ?? []).find((r) => r.id === dep.route_id);
                        return (
                          <TableRow key={dep.id}>
                            <TableCell className="font-medium text-sm">{dep.batch_label}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{route?.code ?? "?"}</Badge></TableCell>
                            <TableCell className="font-mono text-sm">{dep.departure_time}</TableCell>
                            <TableCell className="font-mono text-sm">{dep.arrival_time}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{dep.driver_count}</span></div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={dep.active ? "default" : "secondary"} className="text-xs">{dep.active ? "Aktif" : "Nonaktif"}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditDep(dep)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus jadwal?</AlertDialogTitle>
                                      <AlertDialogDescription>Jadwal "{dep.batch_label} - {route?.code}" akan dihapus secara permanen.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteDep(dep.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── BOOKING ──────────────────────────────────── */}
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
                          <TableCell><Badge variant="secondary" className={`text-xs ${bookingStatusColor[b.status] || ""}`}>{b.status}</Badge></TableCell>
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

      {/* Dialogs */}
      <PickupPointDialog
        open={ppDialogOpen}
        onOpenChange={setPpDialogOpen}
        initial={ppDialogInitial}
        routeId={ppDialogRouteId}
        maxSeq={maxSeqForRoute(ppDialogRouteId)}
      />
      <DepartureDialog
        open={depDialogOpen}
        onOpenChange={setDepDialogOpen}
        initial={depDialogInitial}
        routes={(routes ?? []).map((r) => ({ id: r.id, code: r.code, name: r.name }))}
      />
    </AdminLayout>
  );
}
