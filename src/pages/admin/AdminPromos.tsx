import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminPromos, useUpsertPromo, useDeletePromo, useUpdatePromoActive } from "@/hooks/use-admin-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Promo = Tables<"promos">;

export default function AdminPromos() {
  const { data: promos, isLoading } = useAdminPromos();
  const upsertPromo = useUpsertPromo();
  const deletePromo = useDeletePromo();
  const updateActive = useUpdatePromoActive();

  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", badge: "", start_date: "", end_date: "" });

  const openNew = () => {
    setEditPromo(null);
    setForm({ title: "", subtitle: "", badge: "", start_date: "", end_date: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Promo) => {
    setEditPromo(p);
    setForm({ title: p.title, subtitle: p.subtitle, badge: p.badge || "", start_date: p.start_date, end_date: p.end_date });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    const promo: Promo = {
      id: editPromo?.id ?? `p${Date.now()}`,
      title: form.title,
      subtitle: form.subtitle,
      gradient: editPromo?.gradient ?? "from-violet-500 to-purple-600",
      badge: form.badge || null,
      active: editPromo?.active ?? true,
      start_date: form.start_date,
      end_date: form.end_date,
    };
    upsertPromo.mutate(promo, { onSuccess: () => setDialogOpen(false) });
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Promo Management</h2>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Tambah Promo</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead className="hidden md:table-cell">Periode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(promos ?? []).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className={`h-10 w-20 rounded-lg bg-gradient-to-r ${p.gradient} flex items-center justify-center`}>
                          {p.badge && <span className="text-[9px] font-bold text-white">{p.badge}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {p.start_date} — {p.end_date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.active ? "default" : "secondary"}
                          className="text-xs cursor-pointer"
                          onClick={() => updateActive.mutate({ id: p.id, active: !p.active })}
                        >
                          {p.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deletePromo.mutate(p.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editPromo ? "Edit Promo" : "Tambah Promo Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Judul</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Subtitle</Label>
                <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Badge</Label>
                <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. NEW USER" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>End Date</Label>
                  <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={upsertPromo.isPending}>
                {upsertPromo.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
