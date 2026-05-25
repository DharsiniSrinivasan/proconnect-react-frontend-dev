import { useState } from "react";
import { MapPin, Layers } from "lucide-react";
import type { Region } from "@/mocks/strategicDashboard.mock";

interface MapCardProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelectRegion: (region: Region | null) => void;
}

type MetricType = "cost" | "sla" | "volume";

export const MapCard = ({
  regions,
  selectedRegion,
  onSelectRegion,
}: MapCardProps) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>("cost");

  const getRegionColor = (region: Region) => {
    if (selectedRegion?.id === region.id) return "hsl(185 100% 50%)";

    switch (activeMetric) {
      case "cost":
        return region.costPerKg < 18
          ? "hsl(145 80% 45%)"
          : region.costPerKg < 20
            ? "hsl(38 95% 55%)"
            : "hsl(0 85% 55%)";
      case "sla":
        return region.slaPercent > 95
          ? "hsl(145 80% 45%)"
          : region.slaPercent > 92
            ? "hsl(38 95% 55%)"
            : "hsl(0 85% 55%)";
      case "volume":
        return region.volumeBoxes > 500000
          ? "hsl(270 100% 65%)"
          : region.volumeBoxes > 400000
            ? "hsl(200 100% 55%)"
            : "hsl(185 100% 50%)";
    }
  };

  const getMetricValue = (region: Region) => {
    switch (activeMetric) {
      case "cost":
        return `₹${region.costPerKg}/kg`;
      case "sla":
        return `${region.slaPercent}%`;
      case "volume":
        return `${(region.volumeBoxes / 1000).toFixed(0)}K`;
    }
  };

  return (
    <div className="glass-card neon-border h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Global Performance Map
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {(["cost", "sla", "volume"] as MetricType[]).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeMetric === metric
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {metric === "cost"
                ? "Freight Cost/Kg"
                : metric === "sla"
                  ? "SLA"
                  : "Unit"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative p-4 min-h-[280px]">
        {/* Stylized India Map Placeholder */}
        <div className="absolute inset-4 rounded-lg overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(hsl(185 100% 50% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 50% / 0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Radial glow */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

          {/* Region markers */}
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() =>
                onSelectRegion(selectedRegion?.id === region.id ? null : region)
              }
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group ${
                selectedRegion?.id === region.id
                  ? "z-20 scale-125"
                  : "z-10 hover:scale-110"
              }`}
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`,
              }}
            >
              <div
                className={`w-4 h-4 rounded-full animate-glow-pulse ${
                  selectedRegion?.id === region.id
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : ""
                }`}
                style={{
                  backgroundColor: getRegionColor(region),
                  boxShadow: `0 0 15px ${getRegionColor(region)}`,
                }}
              />
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-6 whitespace-nowrap transition-opacity ${
                  selectedRegion?.id === region.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <div className="glass-card px-2 py-1 text-xs">
                  <p className="font-medium text-foreground">{region.code}</p>
                  <p className="text-primary font-mono">
                    {getMetricValue(region)}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Selected region overlay */}
          {selectedRegion && (
            <div className="absolute bottom-4 left-4 right-4 glass-card p-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {selectedRegion.name}
                </span>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    selectedRegion.priority === "High"
                      ? "chip-danger"
                      : selectedRegion.priority === "Medium"
                        ? "chip-warning"
                        : "chip-success"
                  }`}
                >
                  {selectedRegion.priority} Priority
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Unit</p>
                  <p className="font-mono text-foreground">
                    {(selectedRegion.volumeBoxes / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost/Kg</p>
                  <p className="font-mono text-foreground">
                    ₹{selectedRegion.costPerKg}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">SLA</p>
                  <p className="font-mono text-foreground">
                    {selectedRegion.slaPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Util.</p>
                  <p className="font-mono text-foreground">
                    {selectedRegion.utilisationPercent}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>Monitor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MapCardSkeleton = () => (
  <div className="glass-card h-full flex flex-col">
    <div className="p-4 border-b border-border/50 flex items-center justify-between">
      <div className="skeleton-glow h-5 w-48 rounded" />
      <div className="skeleton-glow h-8 w-40 rounded-lg" />
    </div>
    <div className="flex-1 p-4 min-h-[280px]">
      <div className="skeleton-glow h-full w-full rounded-lg" />
    </div>
    <div className="px-4 pb-4">
      <div className="skeleton-glow h-4 w-48 rounded" />
    </div>
  </div>
);
