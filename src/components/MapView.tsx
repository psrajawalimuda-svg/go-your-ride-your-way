import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  animateMarker?: boolean;
  useGeolocation?: boolean;
  showLocateButton?: boolean;
  pickupPosition?: [number, number];
  destinationPosition?: [number, number];
  showRoute?: boolean;
  nearbyDrivers?: [number, number][];
  onMapClick?: (latlng: [number, number]) => void;
  interactive?: boolean;
  /** Streaming driver position from realtime — smoothly interpolates */
  streamingDriverPosition?: [number, number] | null;
}

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

const PulseIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:16px;height:16px;background:hsl(152,68%,40%);border-radius:50%;box-shadow:0 0 0 6px hsla(152,68%,40%,0.25), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const PickupIcon = L.divIcon({
  className: "pickup-marker",
  html: `<div style="width:14px;height:14px;background:hsl(152,68%,40%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const DestinationIcon = L.divIcon({
  className: "destination-marker",
  html: `<div style="width:14px;height:14px;background:hsl(38,92%,50%);border:3px solid white;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const DriverIcon = L.divIcon({
  className: "driver-marker",
  html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:hsl(220,25%,10%);border-radius:50%;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export function generateRoutePoints(start: [number, number], end: [number, number], steps = 30): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const dLat = end[0] - start[0];
  const dLng = end[1] - start[1];
  const curveLat = midLat + dLng * 0.15;
  const curveLng = midLng - dLat * 0.15;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * curveLat + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * curveLng + t * t * end[1];
    points.push([lat, lng]);
  }
  return points;
}

export function MapView({
  className,
  center,
  zoom = 15,
  markerPosition,
  animateMarker = false,
  useGeolocation = false,
  showLocateButton = true,
  pickupPosition,
  destinationPosition,
  showRoute = false,
  nearbyDrivers,
  onMapClick,
  interactive = false,
  streamingDriverPosition,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const streamingMarkerRef = useRef<L.Marker | null>(null);

  const locateUser = useCallback(() => {
    if (!("geolocation" in navigator) || !mapInstanceRef.current || !markerRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mapInstanceRef.current || !markerRef.current) return;
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        mapInstanceRef.current.setView(latlng, zoom, { animate: true });
        markerRef.current.setLatLng(latlng);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [zoom]);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initialCenter = center || DEFAULT_CENTER;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(initialCenter, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const pos = markerPosition || initialCenter;
    const marker = L.marker(pos, { icon: PulseIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;
    routeLayerRef.current = L.layerGroup().addTo(map);

    if (useGeolocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mapInstanceRef.current) return;
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          map.setView(userPos, zoom);
          marker.setLatLng(userPos);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      routeLayerRef.current = null;
      streamingMarkerRef.current = null;
    };
  }, []);

  // Handle interactive map clicks
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !interactive || !onMapClick) return;

    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    };
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [interactive, onMapClick]);

  // Update pickup/destination markers and route
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    // Clear old markers
    if (pickupMarkerRef.current) { map.removeLayer(pickupMarkerRef.current); pickupMarkerRef.current = null; }
    if (destMarkerRef.current) { map.removeLayer(destMarkerRef.current); destMarkerRef.current = null; }
    routeLayer.clearLayers();

    if (pickupPosition) {
      pickupMarkerRef.current = L.marker(pickupPosition, { icon: PickupIcon }).addTo(map);
    }
    if (destinationPosition) {
      destMarkerRef.current = L.marker(destinationPosition, { icon: DestinationIcon }).addTo(map);
    }

    if (showRoute && pickupPosition && destinationPosition) {
      const routePoints = generateRoutePoints(pickupPosition, destinationPosition);
      L.polyline(routePoints, { color: "rgba(0,0,0,0.1)", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(routeLayer);
      L.polyline(routePoints, { color: "hsl(152,68%,40%)", weight: 4, lineCap: "round", lineJoin: "round", dashArray: "8, 12" }).addTo(routeLayer);
      const bounds = L.latLngBounds([pickupPosition, destinationPosition]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupPosition, destinationPosition, showRoute]);

  // Nearby drivers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !nearbyDrivers) return;

    const markers = nearbyDrivers.map((pos) => L.marker(pos, { icon: DriverIcon }).addTo(map));
    return () => { markers.forEach((m) => map.removeLayer(m)); };
  }, [nearbyDrivers]);

  // Animate marker along route
  useEffect(() => {
    if (!animateMarker || !showRoute || !pickupPosition || !destinationPosition || !markerRef.current) return;

    const routePoints = generateRoutePoints(pickupPosition, destinationPosition);
    let step = 0;
    markerRef.current.setLatLng(pickupPosition);

    const interval = setInterval(() => {
      step++;
      if (step < routePoints.length) {
        markerRef.current?.setLatLng(routePoints[step]);
      } else {
        step = 0;
      }
    }, 200);

    return () => clearInterval(interval);
  }, [animateMarker, pickupPosition, destinationPosition, showRoute]);

  // Streaming driver position — smooth interpolation via realtime
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (streamingDriverPosition) {
      if (!streamingMarkerRef.current) {
        streamingMarkerRef.current = L.marker(streamingDriverPosition, { icon: DriverIcon }).addTo(map);
      } else {
        // Smooth interpolation: animate from current to new position
        const currentLatLng = streamingMarkerRef.current.getLatLng();
        const startLat = currentLatLng.lat;
        const startLng = currentLatLng.lng;
        const endLat = streamingDriverPosition[0];
        const endLng = streamingDriverPosition[1];
        const steps = 20;
        let frame = 0;

        const animate = () => {
          frame++;
          const t = frame / steps;
          const lat = startLat + (endLat - startLat) * t;
          const lng = startLng + (endLng - startLng) * t;
          streamingMarkerRef.current?.setLatLng([lat, lng]);
          if (frame < steps) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    } else if (streamingMarkerRef.current) {
      map.removeLayer(streamingMarkerRef.current);
      streamingMarkerRef.current = null;
    }
  }, [streamingDriverPosition]);

  return (
    <div className={cn("w-full h-full z-0 relative", className)}>
      <div ref={mapRef} className="w-full h-full" />
      {showLocateButton && (
        <button
          onClick={locateUser}
          className="absolute bottom-4 right-4 z-[1000] p-3 bg-card rounded-xl border border-border shadow-lg hover:bg-secondary transition-colors active:scale-95"
          aria-label="Center map on my location"
        >
          <Locate className="h-5 w-5 text-primary" />
        </button>
      )}
    </div>
  );
}
