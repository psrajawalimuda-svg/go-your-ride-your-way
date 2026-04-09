import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus, MapPin, Clock, Users, ChevronLeft, CalendarDays, ArrowRight, ArrowUpDown,
  CreditCard, Wallet, Building2, CheckCircle2, User, Phone, Mail,
  Armchair, Download, Share2,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePayment } from "@/context/PaymentContext";
import { useNotifications } from "@/context/NotificationContext";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

// ─── Data ───────────────────────────────────────────────────────────────────

const CITIES = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang"];

interface Schedule {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  operator: string;
  totalSeats: number;
  availableSeats: number;
}

const ALL_SCHEDULES: Schedule[] = [
  { id: "s1", from: "Jakarta", to: "Bandung", departure: "06:00", arrival: "09:30", duration: "3h 30m", price: 85000, operator: "PYU Express", totalSeats: 40, availableSeats: 28 },
  { id: "s2", from: "Jakarta", to: "Bandung", departure: "08:00", arrival: "11:30", duration: "3h 30m", price: 85000, operator: "PYU Express", totalSeats: 40, availableSeats: 15 },
  { id: "s3", from: "Jakarta", to: "Bandung", departure: "10:00", arrival: "13:30", duration: "3h 30m", price: 95000, operator: "PYU Premium", totalSeats: 40, availableSeats: 32 },
  { id: "s4", from: "Jakarta", to: "Bandung", departure: "14:00", arrival: "17:30", duration: "3h 30m", price: 85000, operator: "PYU Express", totalSeats: 40, availableSeats: 20 },
  { id: "s5", from: "Jakarta", to: "Surabaya", departure: "07:00", arrival: "17:00", duration: "10h", price: 250000, operator: "PYU Premium", totalSeats: 40, availableSeats: 22 },
  { id: "s6", from: "Jakarta", to: "Surabaya", departure: "20:00", arrival: "06:00", duration: "10h", price: 220000, operator: "PYU Night", totalSeats: 40, availableSeats: 18 },
  { id: "s7", from: "Jakarta", to: "Semarang", departure: "06:30", arrival: "12:30", duration: "6h", price: 150000, operator: "PYU Express", totalSeats: 40, availableSeats: 25 },
  { id: "s8", from: "Jakarta", to: "Yogyakarta", departure: "07:00", arrival: "15:00", duration: "8h", price: 200000, operator: "PYU Premium", totalSeats: 40, availableSeats: 30 },
  { id: "s9", from: "Bandung", to: "Jakarta", departure: "06:00", arrival: "09:30", duration: "3h 30m", price: 85000, operator: "PYU Express", totalSeats: 40, availableSeats: 24 },
  { id: "s10", from: "Bandung", to: "Yogyakarta", departure: "08:00", arrival: "16:00", duration: "8h", price: 180000, operator: "PYU Express", totalSeats: 40, availableSeats: 19 },
  { id: "s11", from: "Surabaya", to: "Jakarta", departure: "07:00", arrival: "17:00", duration: "10h", price: 250000, operator: "PYU Premium", totalSeats: 40, availableSeats: 26 },
  { id: "s12", from: "Yogyakarta", to: "Jakarta", departure: "06:00", arrival: "14:00", duration: "8h", price: 200000, operator: "PYU Express", totalSeats: 40, availableSeats: 21 },
];

type BookingStep = "search" | "schedules" | "seats" | "passenger" | "payment" | "ticket";
const STEPS: BookingStep[] = ["search", "schedules", "seats", "passenger", "payment", "ticket"];
const STEP_LABELS = ["Route", "Schedule", "Seats", "Passenger", "Payment", "Ticket"];

type SeatStatus = "available" | "occupied" | "selected";

interface Passenger {
  name: string;
  phone: string;
  email: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSeatMap(totalSeats: number, occupiedCount: number): SeatStatus[] {
  const seats: SeatStatus[] = Array(totalSeats).fill("available");
  const indices = Array.from({ length: totalSeats }, (_, i) => i);
  // Shuffle and pick occupied
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < Math.min(occupiedCount, totalSeats); i++) {
    seats[indices[i]] = "occupied";
  }
  return seats;
}

function formatPrice(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Shuttle() {
  const navigate = useNavigate();
  const { createTransaction } = usePayment();
  const { sendNotification } = useNotifications();
  const [step, setStep] = useState<BookingStep>("search");
  const stepIdx = STEPS.indexOf(step);

  // Step 1
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengerCount, setPassengerCount] = useState(1);

  // Step 2
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Step 3
  const [seatMap, setSeatMap] = useState<SeatStatus[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Step 4
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  // Step 5
  const [paymentMethod, setPaymentMethod] = useState("ewallet");

  // Step 6
  const [bookingId, setBookingId] = useState("");

  // ─── Filtered schedules
  const filteredSchedules = useMemo(
    () => ALL_SCHEDULES.filter((s) => s.from === from && s.to === to),
    [from, to]
  );

  const ticketRef = useRef<HTMLDivElement>(null);

  const captureTicket = async (): Promise<Blob | null> => {
    if (!ticketRef.current) return null;
    const canvas = await html2canvas(ticketRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  };

  const downloadTicket = async () => {
    const blob = await captureTicket();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bookingId}-ticket.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareTicket = async () => {
    const blob = await captureTicket();
    if (!blob) return;
    const file = new File([blob], `${bookingId}-ticket.png`, { type: "image/png" });
    if (navigator.share) {
      await navigator.share({ title: `Shuttle Ticket ${bookingId}`, files: [file] }).catch(() => {});
    } else {
      downloadTicket();
    }
  };

  // ─── Navigation
  const goBack = useCallback(() => {
    const prev = STEPS[stepIdx - 1];
    if (prev) setStep(prev);
  }, [stepIdx]);

  const goToSchedules = () => {
    if (!from || !to || !date) return;
    setSelectedSchedule(null);
    setStep("schedules");
  };

  const goToSeats = () => {
    if (!selectedSchedule) return;
    const occupied = selectedSchedule.totalSeats - selectedSchedule.availableSeats;
    setSeatMap(generateSeatMap(selectedSchedule.totalSeats, occupied));
    setSelectedSeats([]);
    setStep("seats");
  };

  const goToPassenger = () => {
    if (selectedSeats.length !== passengerCount) return;
    setPassengers(
      Array.from({ length: passengerCount }, (_, i) => passengers[i] || { name: "", phone: "", email: "" })
    );
    setStep("passenger");
  };

  const goToPayment = () => {
    const valid = passengers.every((p, i) => p.name.trim() && p.phone.trim() && (i > 0 || p.email.trim()));
    if (!valid) return;
    setStep("payment");
  };

  const confirmBooking = () => {
    const id = "PYU-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingId(id);
    
    // Send shuttle reminder (simulated confirmation)
    sendNotification(
      "shuttle_reminder",
      "Shuttle Booking Confirmed",
      `Your shuttle from ${from} to ${to} on ${date ? format(date, "MMM dd, yyyy") : ""} is confirmed.`,
      { bookingId: id, from, to }
    );

    createTransaction({
      amount: totalPrice,
      description: `Shuttle: ${from} → ${to}`,
      returnPath: "/shuttle",
    });
    navigate("/payment");
  };

  const resetBooking = () => {
    setStep("search");
    setFrom("");
    setTo("");
    setDate(new Date());
    setPassengerCount(1);
    setSelectedSchedule(null);
    setSeatMap([]);
    setSelectedSeats([]);
    setPassengers([]);
    setPaymentMethod("ewallet");
    setBookingId("");
  };

  const toggleSeat = (idx: number) => {
    if (seatMap[idx] === "occupied") return;
    setSelectedSeats((prev) => {
      if (prev.includes(idx)) return prev.filter((s) => s !== idx);
      if (prev.length >= passengerCount) return prev;
      return [...prev, idx];
    });
  };

  const totalPrice = selectedSchedule ? selectedSchedule.price * passengerCount : 0;

  // ─── Render ───────────────────────────────────────────────────────────────

  const anim = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.2 } };

  return (
    <MobileLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          {stepIdx > 0 && step !== "ticket" && (
            <button onClick={goBack} className="p-1.5 rounded-xl hover:bg-secondary/60 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">Shuttle</h1>
            <p className="text-xs text-muted-foreground">{STEP_LABELS[stepIdx]}</p>
          </div>
        </div>

        {/* Step indicator */}
        {step !== "ticket" && (
          <div className="flex gap-1">
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-colors", i <= stepIdx ? "bg-primary" : "bg-secondary")} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Search ────────────────────────────────────────── */}
          {step === "search" && (
            <motion.div key="search" {...anim} className="space-y-4">
              <Card className="p-4 rounded-2xl space-y-4">
                <div className="relative space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">From</Label>
                    <Select value={from} onValueChange={setFrom}>
                      <SelectTrigger className="rounded-xl h-11 bg-secondary/50 border-0">
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.filter((c) => c !== to).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Swap button */}
                  <button
                    type="button"
                    onClick={() => { setFrom(to); setTo(from); }}
                    disabled={!from && !to}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">To</Label>
                    <Select value={to} onValueChange={setTo}>
                      <SelectTrigger className="rounded-xl h-11 bg-secondary/50 border-0">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.filter((c) => c !== from).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start rounded-xl h-11 bg-secondary/50 border-0 font-normal", !date && "text-muted-foreground")}>
                          <CalendarDays className="h-4 w-4 mr-2" />
                          {date ? format(date, "dd MMM") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Passengers</Label>
                    <Select value={String(passengerCount)} onValueChange={(v) => setPassengerCount(Number(v))}>
                      <SelectTrigger className="rounded-xl h-11 bg-secondary/50 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {n} {n === 1 ? "Passenger" : "Passengers"}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Button onClick={goToSchedules} disabled={!from || !to || !date} className="w-full h-12 rounded-2xl text-base font-bold">
                Search Shuttles
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 2: Schedules ─────────────────────────────────────── */}
          {step === "schedules" && (
            <motion.div key="schedules" {...anim} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{to}</span>
                <span className="ml-auto text-xs text-muted-foreground font-normal">{date && format(date, "dd MMM yyyy")}</span>
              </div>

              {filteredSchedules.length === 0 ? (
                <Card className="p-8 rounded-2xl text-center">
                  <Bus className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No shuttles found for this route</p>
                </Card>
              ) : (
                filteredSchedules.map((sch, i) => (
                  <motion.div key={sch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <button
                      onClick={() => setSelectedSchedule(sch)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all",
                        selectedSchedule?.id === sch.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary">{sch.operator}</span>
                        <span className="text-sm font-extrabold">{formatPrice(sch.price)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{sch.departure}</span>
                        <div className="flex-1 flex items-center gap-1">
                          <div className="h-px flex-1 bg-border" />
                          <Bus className="h-3 w-3 text-muted-foreground" />
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <span className="text-lg font-bold">{sch.arrival}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {sch.duration}</span>
                        <span className={cn("flex items-center gap-1", sch.availableSeats <= 5 && "text-destructive font-semibold")}>
                          <Users className="h-3 w-3" /> {sch.availableSeats} seats left
                        </span>
                      </div>
                    </button>
                  </motion.div>
                ))
              )}

              {selectedSchedule && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button onClick={goToSeats} className="w-full h-12 rounded-2xl text-base font-bold">
                    Select Seats
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 3: Seat Selection ────────────────────────────────── */}
          {step === "seats" && (
            <motion.div key="seats" {...anim} className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Select {passengerCount} seat{passengerCount > 1 ? "s" : ""} · {selectedSeats.length}/{passengerCount} chosen
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-md bg-secondary border border-border" /> Available</span>
                <span className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-md bg-primary" /> Selected</span>
                <span className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-md bg-muted-foreground/30" /> Occupied</span>
              </div>

              {/* Bus layout */}
              <Card className="p-4 rounded-2xl">
                {/* Driver area */}
                <div className="flex justify-end mb-4 pr-1">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Armchair className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Seat grid: 10 rows, 2+aisle+2 */}
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, row) => (
                    <div key={row} className="flex items-center justify-center gap-1">
                      {/* Left pair */}
                      {[0, 1].map((col) => {
                        const idx = row * 4 + col;
                        const status = selectedSeats.includes(idx) ? "selected" : seatMap[idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleSeat(idx)}
                            disabled={status === "occupied"}
                            className={cn(
                              "w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                              status === "available" && "bg-secondary border border-border hover:border-primary/40",
                              status === "selected" && "bg-primary text-primary-foreground scale-105",
                              status === "occupied" && "bg-muted-foreground/20 cursor-not-allowed"
                            )}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                      {/* Aisle */}
                      <div className="w-6" />
                      {/* Right pair */}
                      {[2, 3].map((col) => {
                        const idx = row * 4 + col;
                        const status = selectedSeats.includes(idx) ? "selected" : seatMap[idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleSeat(idx)}
                            disabled={status === "occupied"}
                            className={cn(
                              "w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                              status === "available" && "bg-secondary border border-border hover:border-primary/40",
                              status === "selected" && "bg-primary text-primary-foreground scale-105",
                              status === "occupied" && "bg-muted-foreground/20 cursor-not-allowed"
                            )}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Card>

              <Button onClick={goToPassenger} disabled={selectedSeats.length !== passengerCount} className="w-full h-12 rounded-2xl text-base font-bold">
                Continue — Seat{selectedSeats.length > 1 ? "s" : ""} {selectedSeats.map((s) => s + 1).join(", ")}
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 4: Passenger Form ────────────────────────────────── */}
          {step === "passenger" && (
            <motion.div key="passenger" {...anim} className="space-y-4">
              {passengers.map((p, i) => (
                <Card key={i} className="p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold">Passenger {i + 1}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Seat {selectedSeats[i] + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name *</Label>
                      <Input
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[i] = { ...updated[i], name: e.target.value };
                          setPassengers(updated);
                        }}
                        placeholder="Enter full name"
                        className="rounded-xl h-10 bg-secondary/50 border-0 mt-1"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone *</Label>
                      <Input
                        value={p.phone}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[i] = { ...updated[i], phone: e.target.value };
                          setPassengers(updated);
                        }}
                        placeholder="08xxxxxxxxxx"
                        className="rounded-xl h-10 bg-secondary/50 border-0 mt-1"
                        maxLength={15}
                      />
                    </div>
                    {i === 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Email *</Label>
                        <Input
                          value={p.email}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[i] = { ...updated[i], email: e.target.value };
                            setPassengers(updated);
                          }}
                          placeholder="email@example.com"
                          className="rounded-xl h-10 bg-secondary/50 border-0 mt-1"
                          maxLength={255}
                          type="email"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              <Button
                onClick={goToPayment}
                disabled={!passengers.every((p, i) => p.name.trim() && p.phone.trim() && (i > 0 || p.email.trim()))}
                className="w-full h-12 rounded-2xl text-base font-bold"
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 5: Payment ───────────────────────────────────────── */}
          {step === "payment" && (
            <motion.div key="payment" {...anim} className="space-y-4">
              <Card className="p-4 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">{from} → {to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{date && format(date, "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{selectedSchedule?.departure} — {selectedSchedule?.arrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operator</span>
                    <span className="font-medium">{selectedSchedule?.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">{selectedSeats.map((s) => s + 1).join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passengers</span>
                    <span className="font-medium">{passengerCount}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-extrabold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                  {[
                    { value: "ewallet", label: "E-Wallet", icon: Wallet },
                    { value: "bank", label: "Bank Transfer", icon: Building2 },
                    { value: "cash", label: "Cash on Board", icon: CreditCard },
                  ].map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        paymentMethod === value ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <RadioGroupItem value={value} />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Card>

              <Button onClick={confirmBooking} className="w-full h-12 rounded-2xl text-base font-bold">
                Confirm & Pay — {formatPrice(totalPrice)}
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 6: E-Ticket ──────────────────────────────────────── */}
          {step === "ticket" && (
            <motion.div key="ticket" {...anim} className="space-y-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-bold">Booking Confirmed!</h2>
                <p className="text-xs text-muted-foreground">Show this e-ticket to the driver</p>
              </motion.div>

              <Card ref={ticketRef} className="p-5 rounded-2xl space-y-4">
                {/* Ticket header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">E-TICKET</span>
                  <span className="text-xs font-mono text-muted-foreground">{bookingId}</span>
                </div>

                {/* Route */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 text-base font-bold">
                    <span>{from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span>{to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {date && format(date, "EEEE, dd MMMM yyyy")} · {selectedSchedule?.departure} — {selectedSchedule?.arrival}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedSchedule?.operator}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary/50 p-2.5 rounded-xl">
                    <span className="text-muted-foreground block">Seats</span>
                    <span className="font-bold">{selectedSeats.map((s) => s + 1).join(", ")}</span>
                  </div>
                  <div className="bg-secondary/50 p-2.5 rounded-xl">
                    <span className="text-muted-foreground block">Passengers</span>
                    <span className="font-bold">{passengerCount}</span>
                  </div>
                  <div className="bg-secondary/50 p-2.5 rounded-xl col-span-2">
                    <span className="text-muted-foreground block">Total Paid</span>
                    <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Passenger names */}
                <div className="text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">Passengers:</span>
                  {passengers.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">Seat {selectedSeats[i] + 1}</span>
                    </div>
                  ))}
                </div>

                {/* QR Code */}
                <div className="flex justify-center pt-2">
                  <div className="p-3 bg-white rounded-xl">
                    <QRCodeSVG
                      value={`PYU-SHUTTLE:${bookingId}:${from}-${to}:${date && format(date, "yyyy-MM-dd")}:SEATS-${selectedSeats.map((s) => s + 1).join(",")}`}
                      size={140}
                      level="M"
                    />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={downloadTicket} variant="outline" className="h-11 rounded-2xl font-bold">
                  <Download className="h-4 w-4 mr-1.5" /> Download
                </Button>
                <Button onClick={shareTicket} variant="outline" className="h-11 rounded-2xl font-bold">
                  <Share2 className="h-4 w-4 mr-1.5" /> Share
                </Button>
              </div>

              <Button onClick={resetBooking} variant="outline" className="w-full h-11 rounded-2xl font-bold">
                Book Another Shuttle
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
