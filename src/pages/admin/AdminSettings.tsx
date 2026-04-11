import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminSettings, useUpdateSetting } from "@/hooks/use-admin-data";
import { Save, Bike, Car, Crown, MapPin, Settings2, DollarSign } from "lucide-react";
import { toast } from "sonner";

const categoryMeta: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  fares: { label: "Tarif", icon: DollarSign, description: "Konfigurasi tarif dasar dan per kilometer untuk setiap jenis kendaraan" },
  zones: { label: "Zona Layanan", icon: MapPin, description: "Atur area jangkauan dan titik pusat layanan" },
  general: { label: "Umum", icon: Settings2, description: "Pengaturan umum aplikasi, komisi, dan customer support" },
};

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const [edited, setEdited] = useState<Record<string, string>>({});

  const getValue = (key: string) => {
    if (key in edited) return edited[key];
    const s = settings?.find((s) => s.key === key);
    return s ? JSON.parse(s.value as string) : "";
  };

  const handleChange = (key: string, val: string) => {
    setEdited((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (key: string) => {
    const value = edited[key];
    if (value === undefined) return;
    updateSetting.mutate(
      { key, value: JSON.stringify(value) },
      {
        onSuccess: () => {
          setEdited((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
          toast.success("Setting berhasil disimpan");
        },
      }
    );
  };

  const handleSaveCategory = (category: string) => {
    const categorySettings = settings?.filter((s) => s.category === category) ?? [];
    const toSave = categorySettings.filter((s) => s.key in edited);
    if (toSave.length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }
    Promise.all(
      toSave.map((s) =>
        updateSetting.mutateAsync({ key: s.key, value: JSON.stringify(edited[s.key]) })
      )
    ).then(() => {
      setEdited((prev) => {
        const next = { ...prev };
        toSave.forEach((s) => delete next[s.key]);
        return next;
      });
      toast.success(`${toSave.length} setting berhasil disimpan`);
    });
  };

  const grouped = (settings ?? []).reduce<Record<string, typeof settings>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category]!.push(s);
    return acc;
  }, {});

  const fareIcons: Record<string, React.ElementType> = {
    fare_bike_base: Bike, fare_bike_per_km: Bike,
    fare_car_base: Car, fare_car_per_km: Car,
    fare_premium_base: Crown, fare_premium_per_km: Crown,
    fare_womenbike_base: Bike, fare_womenbike_per_km: Bike,
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          {Object.keys(edited).length > 0 && (
            <Badge variant="secondary" className="text-xs">{Object.keys(edited).length} perubahan belum disimpan</Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        ) : (
          <Tabs defaultValue="fares">
            <TabsList>
              {Object.entries(categoryMeta).map(([key, meta]) => (
                <TabsTrigger key={key} value={key} className="gap-1.5">
                  <meta.icon className="h-3.5 w-3.5" />
                  {meta.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categoryMeta).map(([category, meta]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <meta.icon className="h-5 w-5 text-primary" />
                      {meta.label}
                    </CardTitle>
                    <CardDescription>{meta.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(grouped[category] ?? []).map((s) => {
                        const Icon = fareIcons[s.key] ?? meta.icon;
                        const hasChange = s.key in edited;
                        return (
                          <div key={s.key} className="space-y-1.5">
                            <Label className="flex items-center gap-1.5 text-sm">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              {s.label}
                              {hasChange && <span className="text-xs text-amber-500 ml-1">●</span>}
                            </Label>
                            {s.description && (
                              <p className="text-xs text-muted-foreground">{s.description}</p>
                            )}
                            <div className="flex gap-2">
                              <Input
                                value={getValue(s.key)}
                                onChange={(e) => handleChange(s.key, e.target.value)}
                                className="text-sm"
                              />
                              {hasChange && (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="shrink-0"
                                  onClick={() => handleSave(s.key)}
                                  disabled={updateSetting.isPending}
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => handleSaveCategory(category)}
                        disabled={updateSetting.isPending || !(grouped[category] ?? []).some((s) => s.key in edited)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Semua {meta.label}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
