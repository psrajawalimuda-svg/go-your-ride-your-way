import { useState, useEffect, useRef } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

interface ReverseGeoResult {
  name: string;
  address: string;
}

export function useReverseGeocoding(latlng: [number, number] | null, debounceMs = 500) {
  const [result, setResult] = useState<ReverseGeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!latlng) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({
          lat: String(latlng[0]),
          lon: String(latlng[1]),
          format: "json",
          addressdetails: "1",
        });

        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal: controller.signal,
          headers: { "Accept-Language": "en" },
        });

        if (!res.ok) throw new Error("Reverse geocoding failed");

        const data = await res.json();
        const addr = data.address || {};
        const name =
          addr.road || addr.neighbourhood || addr.suburb || data.display_name?.split(",")[0] || "";
        const address =
          [addr.suburb, addr.city || addr.town || addr.village]
            .filter(Boolean)
            .join(", ") || data.display_name?.split(",").slice(1, 3).join(",").trim() || "";

        setResult({ name, address });
      } catch (err: any) {
        if (err.name !== "AbortError") setResult(null);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [latlng?.[0], latlng?.[1], debounceMs]);

  return { ...result, loading };
}
