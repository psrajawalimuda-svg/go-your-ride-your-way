import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ChevronLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Email reset password terkirim!");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout hideNav>
      <div className="px-6 pt-10 pb-6 min-h-screen flex flex-col">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 mb-8"
          >
            <h1 className="text-3xl font-extrabold tracking-tight">Reset Password</h1>
            <p className="text-muted-foreground">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
            </p>
          </motion.div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">Email Terkirim!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Cek inbox <span className="font-semibold">{email}</span> untuk link reset password.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-bold"
                onClick={() => navigate("/login")}
              >
                Kembali ke Login
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-bold text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Kirim Link Reset"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
