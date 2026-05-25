"use client";

import React, { useEffect, useState } from "react";
import { TileLayer } from "react-leaflet";

/* ----------------------------------
   UNIQUE TILE LAYER THEMES
---------------------------------- */
export const TILE_LAYERS = {
  dark: {
    // Dark Matter with detailed map data
    default: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
      name: "Dark Matter",
    },
    // Alternative dark with smooth appearance
    smooth: {
      url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
      name: "Dark Smooth",
    },
    // Esri Dark Gray (premium alternative)
    grey: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri",
      name: "Dark Gray",
    },
  },
  light: {
    // CartoDB Positron (clean light)
    default: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
      name: "Light",
    },
    // CartoDB Voyager (detailed light)
    detailed: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB",
      name: "Light Voyager",
    },
    // OpenTopoMap (topographic)
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenTopoMap",
      name: "Terrain",
    },
  },
};

export type TileLayerMode = keyof typeof TILE_LAYERS;
export type TileLayerVariant =
  | keyof typeof TILE_LAYERS.dark
  | keyof typeof TILE_LAYERS.light;

interface ThemeAwareTileLayerProps {
  variant?: "default" | "smooth" | "grey" | "detailed" | "terrain";
  customDarkUrl?: string;
  customLightUrl?: string;
}

/**
 * ThemeAwareTileLayer - Automatically switches between dark and light tile layers
 * based on the document's light-mode class
 */
export const ThemeAwareTileLayer: React.FC<ThemeAwareTileLayerProps> = ({
  variant = "default",
  customDarkUrl,
  customLightUrl,
}) => {
  const getTheme = () =>
    document.documentElement.classList.contains("light-mode")
      ? "light"
      : "dark";

  const [theme, setTheme] = useState<"light" | "dark">(getTheme());

  /* Watch theme changes */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Get tile layer config based on theme and variant
  const getTileConfig = () => {
    if (theme === "dark") {
      if (customDarkUrl) {
        return {
          url: customDarkUrl,
          attribution: "&copy; Custom",
        };
      }
      const darkVariant =
        TILE_LAYERS.dark[variant as keyof typeof TILE_LAYERS.dark] ||
        TILE_LAYERS.dark.default;
      return {
        url: darkVariant.url,
        attribution: darkVariant.attribution,
      };
    } else {
      if (customLightUrl) {
        return {
          url: customLightUrl,
          attribution: "&copy; Custom",
        };
      }
      const lightVariant =
        TILE_LAYERS.light[variant as keyof typeof TILE_LAYERS.light] ||
        TILE_LAYERS.light.default;
      return {
        url: lightVariant.url,
        attribution: lightVariant.attribution,
      };
    }
  };

  const config = getTileConfig();

  return (
    <TileLayer
      key={theme} // forces tile reload on theme switch
      url={config.url}
      attribution={config.attribution}
    />
  );
};

/**
 * Get a specific tile layer configuration
 */
export const getTileLayer = (mode: TileLayerMode, variant?: string) => {
  const layers = TILE_LAYERS[mode];
  const selectedVariant = variant as keyof typeof layers;
  return layers[selectedVariant] || layers.default;
};
