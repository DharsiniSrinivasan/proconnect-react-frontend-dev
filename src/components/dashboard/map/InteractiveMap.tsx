import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { darkMapStyle, lightMapStyle } from "@/config/mapStyles";
import MarkerDetailCard from "./markerDetail";
import { Fullscreen } from "lucide-react";
import MarkerDetailCardSkeleton from "./markerDetailSkeleton";

export interface RawMarker {
  pincode: string;
  lat: number;
  lng: number;
  locationName: string;
  totalInvoice: number; // total invoices at this location
  billedQuantity: number; // total billed quantity
  onTime: number; // number of on-time deliveries
  delay: number; // number of delayed deliveries
  onTimePercent: number; // on-time percentage
  delayPercent: number; // delay percentage
  plant_name: string;
  address: string;
}

const INDIA_BOUNDS = {
  north: 40, // include China border
  south: 40, // include Sri Lanka
  west: 60, // include Pakistan
  east: 115, // slightly east of India
};
const indiaFocusStyle = [
  {
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
];

interface GoogleMapComponentProps {
  markers: RawMarker[];
  isDark: boolean;
}
const getPrimaryColor = () => {
  const style = getComputedStyle(document.documentElement);
  const value = style.getPropertyValue("--primary").trim();
  return `hsl(${value})`;
};

const createPulsingNeonIcon = (color: string) => {
  const svg = `
  <svg width="80" height="80" viewBox="0 0 80 80"
       xmlns="http://www.w3.org/2000/svg">

    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glowIntense">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- First pulsing outer circle (widest) -->
    <circle cx="40" cy="40" r="12"
      fill="${color}"
      opacity="0.3"
      filter="url(#glowIntense)">
      <animate attributeName="r"
        values="12;28"
        dur="2.2s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.6;0"
        dur="2.2s"
        repeatCount="indefinite" />
    </circle>

    <!-- Second pulsing outer circle (mid) -->
    <circle cx="40" cy="40" r="12"
      fill="${color}"
      opacity="0.4"
      filter="url(#glow)">
      <animate attributeName="r"
        values="12;22"
        dur="1.8s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.5;0"
        dur="1.8s"
        repeatCount="indefinite" />
    </circle>

    <!-- Center neon dot with glow -->
    <circle cx="40" cy="40" r="8"
      fill="${color}"
      stroke="white"
      stroke-width="2"
      filter="url(#glow)" />
  </svg>
  `;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(80, 80),
    anchor: new google.maps.Point(40, 40),
  };
};

const createLightPulseIcon = (color: string) => {
  const svg = `
  <svg width="70" height="70" viewBox="0 0 70 70"
       xmlns="http://www.w3.org/2000/svg">

    <defs>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Outer soft pulse -->
    <circle cx="35" cy="35" r="10"
      fill="${color}"
      opacity="0.35"
      filter="url(#softGlow)">
      <animate attributeName="r"
        values="10;22"
        dur="2s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.5;0"
        dur="2s"
        repeatCount="indefinite" />
    </circle>

    <!-- Inner pulse -->
    <circle cx="35" cy="35" r="10"
      fill="${color}"
      opacity="0.25">
      <animate attributeName="r"
        values="10;18"
        dur="1.6s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.3;0"
        dur="1.6s"
        repeatCount="indefinite" />
    </circle>

    <!-- Center dot -->
    <circle cx="35" cy="35" r="7"
      fill="${color}"
      stroke="white"
      stroke-width="2"
      filter="url(#softGlow)" />
  </svg>
  `;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(70, 70),
    anchor: new google.maps.Point(35, 35),
  };
};

const createOrangeNeonIcon = (isDark: boolean = true) => {
  const svg = `
  <svg width="90" height="90" viewBox="0 0 90 90"
       xmlns="http://www.w3.org/2000/svg">

    <defs>
      <filter id="orangeGlow">
        <feGaussianBlur stdDeviation="9" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="orangeGlowIntense">
        <feGaussianBlur stdDeviation="12" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Outermost pulsing circle -->
    <circle cx="45" cy="45" r="14"
      fill="#ff6b35"
      opacity="0.35"
      filter="url(#orangeGlowIntense)">
      <animate attributeName="r"
        values="14;32"
        dur="2.2s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.7;0"
        dur="2.2s"
        repeatCount="indefinite" />
    </circle>

    <!-- Mid pulsing circle -->
    <circle cx="45" cy="45" r="14"
      fill="#ff8c42"
      opacity="0.45"
      filter="url(#orangeGlow)">
      <animate attributeName="r"
        values="14;26"
        dur="1.8s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.6;0"
        dur="1.8s"
        repeatCount="indefinite" />
    </circle>

    <!-- Inner circle for extra visibility -->
    <circle cx="45" cy="45" r="14"
      fill="#ffa540"
      opacity="0.3">
      <animate attributeName="r"
        values="14;20"
        dur="1.4s"
        repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.4;0"
        dur="1.4s"
        repeatCount="indefinite" />
    </circle>

    <!-- Center bright dot -->
    <circle cx="45" cy="45" r="9"
      fill="#ff6b35"
      stroke="white"
      stroke-width="2.5"
      filter="url(#orangeGlow)" />
  </svg>
  `;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(90, 90),
    anchor: new google.maps.Point(45, 45),
  };
};

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  markers,
  isDark,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    language: "en",
    region: "US",
  });
  const primaryColor = useMemo(() => getPrimaryColor(), [isDark]);
  const hasFitted = useRef(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 20.5937,   // default India center
    lng: 78.9629,
  });
  const [selectedMarker, setSelectedMarker] = useState<RawMarker | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [selectedPincode, setSelectedPincode] = useState<string | null>(null);

  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const markerIcon = useMemo(() => {
    if (!isLoaded) return null; // wait until Google Maps is loaded
    return isDark
      ? createPulsingNeonIcon(primaryColor)
      : createLightPulseIcon(primaryColor);
  }, [isDark, primaryColor, isLoaded]);

  const orangeMarkerIcon = useMemo(() => {
    if (!isLoaded) return null;
    return createOrangeNeonIcon(isDark);
  }, [isLoaded, isDark]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  useEffect(() => {
    if (!mapRef || !markers?.length || hasFitted.current) return;

    const bounds = new google.maps.LatLngBounds();

    markers.forEach((m) => {
      bounds.extend({ lat: m.lat, lng: m.lng });
    });

    mapRef.fitBounds(bounds);

    // prevent refitting again
    hasFitted.current = true;
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapWrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Update map styles when theme changes
  useEffect(() => {
    if (!mapRef) return;
    mapRef.setOptions({ styles: isDark ? darkMapStyle : lightMapStyle });
  }, [isDark, mapRef]);

  const handleMarkerClick = (marker: RawMarker) => {
    setIsLoadingDetails(true);
    setSelectedPincode(marker.pincode);

    if (mapRef) {
      const targetLatLng = new google.maps.LatLng(marker.lat, marker.lng);

      // Get current zoom
      const currentZoom = mapRef.getZoom();

      // If current zoom is too close, zoom out first before panning
      const intermediateZoom = 7; // zoom out to see both markers
      const targetZoom = 8; // zoom in on selected marker

      // Step 1: Zoom out if current zoom > intermediateZoom
      if (currentZoom && currentZoom > intermediateZoom) {
        mapRef.setZoom(intermediateZoom);
        setTimeout(() => {
          // Step 2: Pan to the new marker
          mapRef.panTo(targetLatLng);

          setTimeout(() => {
            // Step 3: Zoom in on the new marker
            mapRef.setZoom(targetZoom);
          }, 500); // small delay for smooth pan
        }, 300); // small delay for zoom out
      } else {
        // If already zoomed out enough, just pan and zoom
        setMapCenter({
          lat: marker.lat,
          lng: marker.lng,
        });
        mapRef.setZoom(targetZoom);
      }
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: marker.lat, lng: marker.lng } },
      (results, status) => {
        if (status === "OK" && results?.length) {
          const components = results[0].address_components;
          const locality =
            components.find((c) => c.types.includes("neighborhood")) ||
            components.find((c) => c.types.includes("sublocality_level_1")) ||
            components.find((c) => c.types.includes("locality")) ||
            components.find((c) => c.types.includes("postal_town"));

          const locationName = [locality?.long_name].filter(Boolean).join(", ");
          setSelectedMarker({
            ...marker,
            locationName: locationName || results[0].formatted_address,
            address: results[0].formatted_address,
          });
        }
        setIsLoadingDetails(false);
      },
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading Map…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full w-full rounded-md overflow-hidden border border-border shadow-sm">
      <div className="px-4 py-2 bg-primary/10 z-10">
        <h3 className="text-sm text-primary font-semibold">
          Warehouse Locations
        </h3>
      </div>

      <div className="relative flex-1" ref={mapWrapperRef}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          mapTypeId="roadmap"
          zoom={5}
          center={mapCenter}
          onLoad={onLoad}
          options={{
            styles: isDark
              ? [...darkMapStyle, ...indiaFocusStyle]
              : [...lightMapStyle, ...indiaFocusStyle],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            restriction: {
              latLngBounds: INDIA_BOUNDS,
              strictBounds: true,
            },
            minZoom: 5,
            maxZoom: 12,
          }}
        >
          {markers?.map((marker) => (
            <Marker
              key={marker.pincode}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
              icon={
                selectedPincode === marker.pincode
                  ? orangeMarkerIcon
                  : markerIcon
              }
            />
          ))}
          {selectedMarker && (
            <div className="absolute top-2 right-20 z-50">
              {isLoadingDetails ? (
                <MarkerDetailCardSkeleton
                  onClose={() => {
                    setSelectedMarker(null);
                    setSelectedPincode(null);
                    setIsLoadingDetails(false);
                  }}
                />
              ) : (
                <MarkerDetailCard
                  marker={selectedMarker}
                  onClose={() => {
                    setSelectedMarker(null);
                    setSelectedPincode(null);
                    setIsLoadingDetails(false);
                  }}
                />
              )}
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 bg-primary px-3 py-2 rounded shadow text-primary-foreground"
          >
            <Fullscreen />
          </button>
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
