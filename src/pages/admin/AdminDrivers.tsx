import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  useAdminDrivers, 
  useUpdateDriverApproval, 
  useAdminDriverApplications, 
  useReviewDriverApplication,
  type DriverApplication
} from "@/hooks/use-admin-data";
import { Search, Star, ExternalLink, Check, X } from "lucide-react";

const statusColor: Record<string, string> = {
  online: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  busy: "bg-amber-500/10 text-amber-600 border-amber-200",
  offline: "bg-muted text-muted-foreground",
};

export default function AdminDrivers() {
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);
  const { data: drivers, isLoading: loadingDrivers } = useAdminDrivers();
  const { data: applications, isLoading: loadingApps } = useAdminDriverApplications();
  const updateApproval = useUpdateDriverApproval();
  const reviewApp = useReviewDriverApplication();

  const filteredDrivers = (drivers ?? []).filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.vehicle_plate.toLowerCase().includes(search.toLowerCase())
  );

  const pendingApps = (applications ?? []).filter((app): app is DriverApplication => app.status === "pending");

  const handleReview = (status: "approved" | "rejected") => {
    if (!selectedApp) return;
    reviewApp.mutate({ id: selectedApp.id, status }, {
      onSuccess: () => setSelectedApp(null)
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Driver Management</h2>
          <div className="flex gap-2">
            <Badge variant="secondary">{drivers?.length ?? 0} active</Badge>
            <Badge variant="outline">{pendingApps.length} pending apps</Badge>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="active">Active Drivers</TabsTrigger>
            <TabsTrigger value="applications">Applications {pendingApps.length > 0 && <Badge variant="destructive" className="ml-2 px-1.5 h-4 text-[10px]">{pendingApps.length}</Badge>}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau plat..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <Card>
              <CardContent className="p-0">
                {loadingDrivers ? (
                  <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
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
                      {filteredDrivers.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.vehicle_plate}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{d.vehicle_model}</p>
                              <Badge variant="outline" className="text-[10px]">{d.vehicle_class}</Badge>
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
                          <TableCell className="hidden md:table-cell">{d.total_trips}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              disabled={updateApproval.isPending}
                              onClick={() => updateApproval.mutate({ id: d.id, approved: !d.approved })}
                            >
                              {d.approved ? "Suspend" : "Approve"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardContent className="p-0">
                {loadingApps ? (
                  <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : pendingApps.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No pending applications</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApps.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{app.full_name}</p>
                              <p className="text-xs text-muted-foreground">{app.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{app.vehicle_model}</p>
                              <Badge variant="outline" className="text-[10px] uppercase">{app.vehicle_type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                              Review
                            </Button>
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

        {/* Application Review Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Driver Application</DialogTitle>
              <DialogDescription>Check all details and documents before approval.</DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold border-b pb-1">Personal & License</h3>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="text-sm font-medium">{selectedApp.full_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">License Number (SIM)</p>
                      <p className="text-sm font-medium">{selectedApp.license_number}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">License Expiry</p>
                      <p className="text-sm font-medium">{selectedApp.license_expiry}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold border-b pb-1">Vehicle Details</h3>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Model & Plate</p>
                      <p className="text-sm font-medium">{selectedApp.vehicle_model} ({selectedApp.vehicle_plate})</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Vehicle Type & Year</p>
                      <p className="text-sm font-medium uppercase">{selectedApp.vehicle_type} - {selectedApp.vehicle_year}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold border-b pb-1">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "KTP", url: selectedApp.ktp_url },
                      { label: "SIM", url: selectedApp.license_url },
                      { label: "STNK", url: selectedApp.stnk_url },
                      { label: "Vehicle", url: selectedApp.vehicle_photo_url },
                    ].map((doc) => (
                      <div key={doc.label} className="space-y-2">
                        <p className="text-xs text-muted-foreground">{doc.label}</p>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block aspect-video rounded-lg overflow-hidden border bg-muted relative group"
                        >
                          <img src={doc.url} alt={doc.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="h-6 w-6 text-white" />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="destructive" 
                onClick={() => handleReview("rejected")}
                disabled={reviewApp.isPending}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button 
                variant="default" 
                onClick={() => handleReview("approved")}
                disabled={reviewApp.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="mr-2 h-4 w-4" /> Approve & Activate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
