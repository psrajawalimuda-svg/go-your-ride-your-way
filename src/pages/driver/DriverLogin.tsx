import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/context/DriverContext";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, ArrowRight, Car } from "lucide-react";

export default function DriverLogin() {
  const navigate = useNavigate();
  const { login } = useDriver();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = () => {
    if (phone.length >= 10) setStep("otp");
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      login(phone);
      navigate("/driver/home");
    }
  };

  return (
    <DriverLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-2">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Driver App</h1>
          <p className="text-muted-foreground text-center text-sm">
            {step === "phone" ? "Enter your phone number to get started" : `We sent a code to +62 ${phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <div className="w-full max-w-xs flex flex-col gap-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="812 3456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="pl-10 h-12 text-lg"
                maxLength={13}
              />
            </div>
            <Button onClick={handleSendOTP} disabled={phone.length < 10} className="h-12 text-base font-semibold">
              Send OTP <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-xs flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button onClick={handleVerify} disabled={otp.length < 6} className="w-full h-12 text-base font-semibold">
              Verify & Login
            </Button>
            <button onClick={() => setStep("phone")} className="text-sm text-muted-foreground hover:text-foreground">
              Change number
            </button>
          </div>
        )}

        <div className="mt-auto py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/driver/register")}
              className="text-primary font-bold hover:underline"
            >
              Register as Driver
            </button>
          </p>
        </div>
      </div>
    </DriverLayout>
  );
}
