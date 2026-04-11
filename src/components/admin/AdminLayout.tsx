import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pyugo_admin");
    if (!stored) {
      navigate("/admin/login", { replace: true });
    } else {
      setAdmin(stored);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("pyugo_admin");
    navigate("/admin/login", { replace: true });
  };

  if (!admin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold text-foreground truncate">Pyugo Admin Panel</h1>
            <span className="ml-auto text-xs text-muted-foreground">{admin}</span>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
