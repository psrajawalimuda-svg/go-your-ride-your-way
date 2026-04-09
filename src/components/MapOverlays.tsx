import React from 'react';
import { MapPin, Navigation, Car } from "lucide-react";

interface MapPinProps {
  isDestination?: boolean;
}

export const LocationPin: React.FC<MapPinProps> = ({ isDestination = false }) => (
  <div className={`p-2 rounded-full text-white shadow-lg ring-4 ring-white ${
    isDestination ? 'bg-secondary' : 'bg-primary'
  }`}>
    {isDestination ? <MapPin className="h-5 w-5" /> : <Navigation className="h-5 w-5" />}
  </div>
);

interface DriverMarkerProps {
  heading?: number;
}

export const DriverMarker: React.FC<DriverMarkerProps> = ({ heading = 0 }) => (
  <div 
    className="bg-white p-2 rounded-full text-primary shadow-lg ring-1 ring-border"
    style={{ transform: `rotate(${heading}deg)` }}
  >
    <Car className="h-6 w-6" />
  </div>
);
