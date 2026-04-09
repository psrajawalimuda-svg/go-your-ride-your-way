import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Building2, CreditCard, Smartphone, QrCode, Banknote, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePayment, type PaymentMethodType } from "@/context/PaymentContext";
import { useNotifications } from "@/context/NotificationContext";
import { QRCodeSVG } from "qrcode.react";

const methods: { id: PaymentMethodType; label: string; desc: string; icon: typeof Wallet }[] = [
  { id: "cash", label: "Cash", desc: "Pay driver directly", icon: Banknote },
  { id: "wallet", label: "PYUGO Wallet", desc: "Pay from your balance", icon: Wallet },
  { id: "bank_transfer", label: "Bank Transfer", desc: "Virtual account number", icon: Building2 },
  { id: "ewallet", label: "E-Wallet", desc: "GoPay, OVO, Dana, etc.", icon: Smartphone },
  { id: "qris", label: "QRIS", desc: "Scan QR code to pay", icon: QrCode },
  { id: "credit_card", label: "Credit Card", desc: "Visa, Mastercard", icon: CreditCard },
];

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function Payment() {
  const navigate = useNavigate();
  const { activeTransaction, processPayment, walletBalance } = usePayment();
  const { sendNotification } = useNotifications();
  const [selected, setSelected] = useState<PaymentMethodType>("wallet");
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [copied, setCopied] = useState(false);

  if (!activeTransaction) {
    navigate("/home");
    return null;
  }

  const amount = activeTransaction.amount;
  const vaNumber = "8800" + activeTransaction.id.replace(/\D/g, "").slice(0, 12).padEnd(12, "0");

  const handlePay = async () => {
    if (selected === "wallet" && walletBalance < amount) return;
    setProcessing(true);
    await processPayment(activeTransaction.id, selected);
    
    // Send notification
    await sendNotification(
      "payment_success",
      "Payment Successful",
      `Your payment of ${formatRp(amount)} for "${activeTransaction.description}" was successful.`,
      { transactionId: activeTransaction.id, amount }
    );

    setProcessing(false);
    navigate("/payment/status");
  };

  const copyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MobileLayout hideNav>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl hover:bg-secondary/60 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold">Payment</h1>
            <p className="text-xs text-muted-foreground">{activeTransaction.description}</p>
          </div>
        </div>

        {/* Amount */}
        <Card className="p-5 rounded-2xl text-center">
          <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{formatRp(amount)}</p>
        </Card>

        {/* Method selection */}
        <div>
          <h3 className="text-sm font-bold mb-3">Select Payment Method</h3>
          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                disabled={processing}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                  selected === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                )}
              >
                <div className={cn("p-2.5 rounded-xl", selected === m.id ? "bg-primary/10" : "bg-secondary")}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
                {m.id === "wallet" && (
                  <span className={cn("text-xs font-bold", walletBalance >= amount ? "text-primary" : "text-destructive")}>
                    {formatRp(walletBalance)}
                  </span>
                )}
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", selected === m.id ? "border-primary" : "border-muted-foreground/30")}>
                  {selected === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Method-specific UI */}
        <AnimatePresence mode="wait">
          {selected === "bank_transfer" && (
            <motion.div key="bank" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card className="p-4 rounded-2xl space-y-3">
                <p className="text-xs text-muted-foreground font-medium">Virtual Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-mono font-bold flex-1 tracking-wider">{vaNumber}</p>
                  <button onClick={copyVA} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Transfer exact amount to this VA number</p>
              </Card>
            </motion.div>
          )}

          {selected === "qris" && (
            <motion.div key="qris" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card className="p-4 rounded-2xl flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground font-medium">Scan to Pay</p>
                <div className="p-3 bg-white rounded-xl">
                  <QRCodeSVG value={`PYUGO-PAY:${activeTransaction.id}:${amount}`} size={160} level="M" />
                </div>
                <p className="text-xs text-muted-foreground">Use any QRIS-supported app</p>
              </Card>
            </motion.div>
          )}

          {selected === "credit_card" && (
            <motion.div key="cc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card className="p-4 rounded-2xl space-y-3">
                <p className="text-xs text-muted-foreground font-medium">Card Details</p>
                <Input
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  className="rounded-xl h-11 bg-secondary/50 border-0 font-mono tracking-wider"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="MM/YY" className="rounded-xl h-11 bg-secondary/50 border-0" maxLength={5} />
                  <Input placeholder="CVV" className="rounded-xl h-11 bg-secondary/50 border-0" maxLength={4} type="password" />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pay button */}
        <Button
          onClick={handlePay}
          disabled={processing || (selected === "wallet" && walletBalance < amount)}
          className="w-full h-12 rounded-2xl text-base font-bold"
        >
          {processing ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing...</span>
          ) : selected === "wallet" && walletBalance < amount ? (
            "Insufficient Balance"
          ) : (
            `Pay ${formatRp(amount)}`
          )}
        </Button>
      </div>
    </MobileLayout>
  );
}
