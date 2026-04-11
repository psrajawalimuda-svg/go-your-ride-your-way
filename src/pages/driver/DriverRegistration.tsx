import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  User, 
  CreditCard, 
  Car, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  Tag,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MobileLayout } from "@/components/layout/MobileLayout";

type Step = "personal" | "license" | "vehicle" | "documents" | "success";

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("personal");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleType: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleYear: "",
  });

  // File State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    ktp: null,
    stnk: null,
    license: null,
    vehiclePhoto: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vehicleType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user?.id}/${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("driver-documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("driver-documents")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload all documents
      const uploadPromises = Object.entries(files).map(([field, file]) => {
        if (!file) throw new Error(`${field} is required`);
        return uploadFile(file, field);
      });

      const urls = await Promise.all(uploadPromises);
      const [ktp_url, stnk_url, license_url, vehicle_photo_url] = urls;

      // 2. Save application to DB
      const { error } = await (supabase as any).from("driver_applications").insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        license_number: formData.licenseNumber,
        license_expiry: formData.licenseExpiry,
        vehicle_type: formData.vehicleType,
        vehicle_model: formData.vehicleModel,
        vehicle_plate: formData.vehiclePlate,
        vehicle_year: parseInt(formData.vehicleYear),
        ktp_url,
        stnk_url,
        license_url,
        vehicle_photo_url,
        status: "pending"
      });

      if (error) throw error;

      setStep("success");
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === "personal") setStep("license");
    else if (step === "license") setStep("vehicle");
    else if (step === "vehicle") setStep("documents");
  };

  const prevStep = () => {
    if (step === "license") setStep("personal");
    else if (step === "vehicle") setStep("license");
    else if (step === "documents") setStep("vehicle");
    else navigate(-1);
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-10 pb-24 min-h-screen flex flex-col bg-background">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={prevStep} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Driver Registration</h1>
            <p className="text-xs text-muted-foreground">Step {step === "personal" ? "1" : step === "license" ? "2" : step === "vehicle" ? "3" : "4"} of 4</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <User className="h-5 w-5" />
                  <h2 className="font-bold">Personal Information</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (as per KTP)</Label>
                  <Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="081234567890" className="h-12 rounded-xl" />
                </div>
              </div>
              <Button onClick={nextStep} className="w-full h-12 rounded-xl font-bold mt-4">Next Step</Button>
            </motion.div>
          )}

          {step === "license" && (
            <motion.div
              key="license"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <CreditCard className="h-5 w-5" />
                  <h2 className="font-bold">License Details</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Driver's License Number (SIM)</Label>
                  <Input id="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="1234567890" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input id="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full h-12 rounded-xl font-bold mt-4">Next Step</Button>
            </motion.div>
          )}

          {step === "vehicle" && (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Car className="h-5 w-5" />
                  <h2 className="font-bold">Vehicle Information</h2>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select onValueChange={handleSelectChange} defaultValue={formData.vehicleType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Motorcycle (Bike)</SelectItem>
                      <SelectItem value="car">Car (Standard)</SelectItem>
                      <SelectItem value="premium">Premium Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model (Brand & Type)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input id="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="Toyota Avanza" className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate">License Plate</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input id="vehiclePlate" value={formData.vehiclePlate} onChange={handleInputChange} placeholder="B 1234 ABC" className="pl-10 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Vehicle Year</Label>
                    <Input id="vehicleYear" type="number" value={formData.vehicleYear} onChange={handleInputChange} placeholder="2022" className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full h-12 rounded-xl font-bold mt-4">Next Step</Button>
            </motion.div>
          )}

          {step === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <FileText className="h-5 w-5" />
                  <h2 className="font-bold">Required Documents</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Upload clear photos of your documents. Maximum 5MB per file.</p>
                
                {[
                  { id: "ktp", label: "KTP (Identity Card)", icon: User },
                  { id: "license", label: "SIM (Driver's License)", icon: CreditCard },
                  { id: "stnk", label: "STNK (Vehicle Registration)", icon: FileText },
                  { id: "vehiclePhoto", label: "Vehicle Photograph", icon: Car },
                ].map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <Label>{doc.label}</Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, doc.id)}
                        className="hidden"
                        id={`file-${doc.id}`}
                      />
                      <label
                        htmlFor={`file-${doc.id}`}
                        className={cn(
                          "flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                          files[doc.id] ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        {files[doc.id] ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium flex-1">
                          {files[doc.id] ? (files[doc.id] as File).name : `Click to upload ${doc.id.toUpperCase()}`}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleSubmit} 
                className="w-full h-12 rounded-xl font-bold mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Application"}
              </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold">Application Submitted!</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Your registration is now being reviewed by our team. This usually takes 24-48 hours. We'll notify you once it's approved!
              </p>
              <Button onClick={() => navigate("/home")} className="w-full h-12 rounded-xl font-bold">
                Back to Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
