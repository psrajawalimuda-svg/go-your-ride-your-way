import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Navigation, Car, Bike, Info, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { LocationPin, DriverMarker } from "@/components/MapOverlays";

const DesignSystem = () => {
  const [selectedRide, setSelectedRide] = useState<string>('ride-1');

  const colors = [
    { name: 'Primary (Emerald Green)', class: 'bg-primary', hex: '#22C55E' },
    { name: 'Secondary (Dark Navy)', class: 'bg-secondary', hex: '#1E293B' },
    { name: 'Accent (Mobility Blue)', class: 'bg-accent', hex: '#3B82F6' },
    { name: 'Neutral (Onyx Black)', class: 'bg-foreground', hex: '#0F172A' },
    { name: 'Muted (Slate Gray)', class: 'bg-muted-foreground', hex: '#64748B' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Design System</h1>
          <p className="text-muted-foreground">Comprehensive UI documentation for Go Your Ride.</p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Typography</span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Display</p>
              <h1 className="text-5xl font-bold">Display Text</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heading 1</p>
              <h1 className="text-3xl font-bold">Heading 1</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heading 2</p>
              <h2 className="text-xl font-semibold">Heading 2</h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body Large</p>
              <p className="text-base font-medium">Body Large text for main content.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body Small</p>
              <p className="text-sm text-muted-foreground">Body Small text for secondary information.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color Palette</span>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-20 w-full rounded-2xl shadow-sm border ${color.class}`} />
                <div>
                  <p className="text-sm font-bold truncate">{color.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Button System</span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-4">
            <Button className="w-full h-14 rounded-2xl text-lg font-semibold">
              Primary Action (Confirm Booking)
            </Button>
            <Button variant="secondary" className="w-full h-14 rounded-2xl text-lg font-semibold">
              Secondary Action (Cancel)
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-semibold">
              Outline Action
            </Button>
            <Button disabled className="w-full h-14 rounded-2xl text-lg font-semibold">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading State
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ride Option Cards</span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {[
              { id: 'ride-1', title: 'GoRide', desc: 'Fast motorcycle ride', price: 'IDR 12,000', icon: Bike },
              { id: 'ride-2', title: 'GoCar', desc: 'Comfortable car ride', price: 'IDR 35,000', icon: Car },
            ].map((ride) => (
              <Card 
                key={ride.id}
                className={`cursor-pointer transition-all duration-200 border-2 rounded-2xl ${
                  selectedRide === ride.id ? 'border-primary bg-primary/5 shadow-md' : 'border-transparent'
                }`}
                onClick={() => setSelectedRide(ride.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-xl">
                    <ride.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{ride.title}</h4>
                    <p className="text-sm text-muted-foreground">{ride.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">{ride.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Map Overlays</span>
            <Separator className="flex-1" />
          </div>
          <div className="flex justify-around items-center p-8 bg-muted/30 rounded-3xl">
            <div className="flex flex-col items-center gap-2">
              <LocationPin />
              <p className="text-xs font-bold">Pickup</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LocationPin isDestination />
              <p className="text-xs font-bold">Destination</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DriverMarker heading={45} />
              <p className="text-xs font-bold">Driver</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bottom Sheets</span>
            <Separator className="flex-1" />
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="lg" className="w-full h-14 rounded-2xl">Show Bottom Sheet</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-bold">Trip Details</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup Location</p>
                      <p className="font-bold">Central Park Station</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 p-2 rounded-lg"><Navigation className="h-5 w-5 text-secondary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Destination</p>
                      <p className="font-bold">Grand Indonesia Mall</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <p className="font-bold">Total Fare</p>
                    <p className="text-2xl font-bold">IDR 35,000</p>
                  </div>
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold">Book Ride Now</Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem;
