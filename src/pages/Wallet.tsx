import { Wallet as WalletIcon, Plus, CreditCard, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useWalletTransactions } from "@/hooks/use-app-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function Wallet() {
  const { data: dbTransactions, isLoading } = useWalletTransactions();

  // Compute wallet balance from successful transactions
  const walletBalance = (dbTransactions || [])
    .filter((tx) => tx.status === "success" && tx.method === "wallet")
    .reduce((sum, tx) => sum - tx.amount, 180000); // Start from initial balance

  const allTransactions = (dbTransactions || [])
    .filter((tx) => tx.status === "success")
    .map((tx) => ({
      id: tx.id,
      label: tx.description,
      amount: tx.method === "wallet" ? -tx.amount : tx.amount,
      date: new Date(tx.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      type: tx.method === "wallet" ? "out" as const : "in" as const,
    }));

  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-5">
        <h1 className="text-xl font-extrabold">Wallet</h1>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 rounded-2xl bg-primary text-primary-foreground">
            <p className="text-sm font-medium opacity-80">Your Balance</p>
            {isLoading ? (
              <Skeleton className="h-9 w-32 mt-1 bg-white/20" />
            ) : (
              <p className="text-3xl font-extrabold mt-1">Rp {walletBalance.toLocaleString("id-ID")}</p>
            )}
            <Button
              variant="secondary"
              className="mt-4 h-10 rounded-xl font-bold gap-2"
            >
              <Plus className="h-4 w-4" />
              Top Up
            </Button>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-sm font-bold mb-2">Payment Methods</h3>
          <Card className="rounded-2xl divide-y divide-border">
            {[
              { label: "PYUGO Wallet", sub: `Rp ${walletBalance.toLocaleString("id-ID")}`, icon: WalletIcon },
              { label: "Visa •••• 4821", sub: "Expires 08/27", icon: CreditCard },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-sm font-bold mb-2">Recent Transactions</h3>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : allTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-1">
              {allTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${tx.type === "in" ? "bg-primary/10" : "bg-secondary"}`}>
                    {tx.type === "in" ? (
                      <ArrowDownLeft className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{tx.label}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "in" ? "text-primary" : "text-foreground"}`}>
                    {tx.type === "in" ? "+" : ""}Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
