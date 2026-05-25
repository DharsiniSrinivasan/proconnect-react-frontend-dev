import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type ThemePreset = "NEO_DARK" | "NEO_PURPLE" | "NEO_CYAN";
export type ThemeMode = "LIGHT" | "DARK";

export interface BrandingSettings {
  logoUrl: string | null;
  appName: string;
  tagline: string;
}

export interface ThemeSettings {
  preset: ThemePreset;
  themeMode: ThemeMode;
  accentColor: string;
  compactMode: boolean;
  motionEnabled: boolean;
}

export interface ThemePresetDefinition {
  id: string;
  name: string;
  settings: ThemeSettings;
  isActive: boolean;
  isSystem?: boolean;
}

interface ThemeContextValue {
  settings: ThemeSettings;
  setSettings: (next: ThemeSettings) => void;
  branding: BrandingSettings;
  setBranding: (next: BrandingSettings) => void;
  presets: ThemePresetDefinition[];
  setPresets: (next: ThemePresetDefinition[]) => void;
  activePresetId: string | null;
  setActivePresetId: (id: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const presetDefaults: Record<
  ThemePreset,
  { accentColor: string; cssVars: Record<string, string> }
> = {
  NEO_DARK: {
    accentColor: "#22d3ee",
    cssVars: {
      "--background": "222 47% 6%",
      "--card": "222 47% 9%",
      "--primary": "185 100% 50%",
      "--primary-glow": "185 100% 60%",
      "--secondary": "270 100% 65%",
      "--sidebar-background": "222 47% 5%",
    },
  },
  NEO_PURPLE: {
    accentColor: "#a855f7",
    cssVars: {
      "--background": "260 30% 8%",
      "--card": "260 30% 11%",
      "--primary": "270 100% 65%",
      "--primary-glow": "270 100% 75%",
      "--secondary": "185 100% 50%",
      "--sidebar-background": "260 30% 6%",
    },
  },
  NEO_CYAN: {
    accentColor: "#06b6d4",
    cssVars: {
      "--background": "190 40% 6%",
      "--card": "190 40% 9%",
      "--primary": "185 85% 45%",
      "--primary-glow": "185 85% 55%",
      "--secondary": "270 100% 65%",
      "--sidebar-background": "190 40% 5%",
    },
  },
};

// Light mode CSS variable overrides
const lightModeVars: Record<string, string> = {
  "--background": "210 40% 98%",
  "--foreground": "222 47% 11%",
  "--card": "0 0% 100%",
  "--card-foreground": "222 47% 11%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "222 47% 11%",
  "--muted": "210 40% 93%",
  "--muted-foreground": "215 16% 47%",
  "--border": "214 32% 85%",
  "--input": "214 32% 91%",
  "--sidebar-background": "210 40% 96%",
  "--sidebar-foreground": "222 47% 11%",
  "--sidebar-accent": "210 40% 93%",
  "--sidebar-accent-foreground": "222 47% 11%",
  "--sidebar-border": "214 32% 85%",
};

const accentColorPresets = [
  { name: "Cyan", hex: "#22d3ee", hsl: "185 85% 55%" },
  { name: "Violet", hex: "#a855f7", hsl: "270 100% 65%" },
  { name: "Magenta", hex: "#ec4899", hsl: "330 85% 60%" },
  { name: "Lime", hex: "#84cc16", hsl: "85 85% 45%" },
  { name: "Orange", hex: "#f97316", hsl: "25 95% 53%" },
  { name: "Blue", hex: "#3b82f6", hsl: "217 90% 60%" },
];

export { accentColorPresets };

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "185 85% 55%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Helper to get preview colors for a preset
export function getPresetPreviewColors(settings: ThemeSettings): {
  bg: string;
  accent: string;
  sidebar: string;
  text: string;
} {
  const isLight = settings.themeMode === "LIGHT";
  const presetConfig =
    presetDefaults[settings.preset as ThemePreset] ?? presetDefaults.NEO_DARK;

  if (isLight) {
    return {
      bg: "hsl(210 40% 98%)",
      accent: settings.accentColor,
      sidebar: "hsl(210 40% 96%)",
      text: "hsl(222 47% 11%)",
    };
  }

  const bgHsl = presetConfig.cssVars["--background"];
  const sidebarHsl = presetConfig.cssVars["--sidebar-background"];

  return {
    bg: `hsl(${bgHsl})`,
    accent: settings.accentColor,
    sidebar: `hsl(${sidebarHsl})`,
    text: "hsl(210 40% 96%)",
  };
}

const defaultBranding: BrandingSettings = {
  logoUrl: null,
  appName: "D2R",
  tagline: "Direct to Retail",
};

const defaultSettings: ThemeSettings = {
  preset: "NEO_DARK",
  themeMode: "DARK",
  accentColor: "#22d3ee",
  compactMode: false,
  motionEnabled: true,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [presets, setPresets] = useState<ThemePresetDefinition[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Apply theme settings to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const presetConfig =
      presetDefaults[settings.preset as ThemePreset] ?? presetDefaults.NEO_DARK;
    const isLight = settings.themeMode === "LIGHT";

    // Apply theme mode class
    if (isLight) {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    }

    // Apply base preset CSS vars (dark mode)
    if (!isLight) {
      Object.entries(presetConfig.cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      // Reset to dark mode defaults
      root.style.setProperty("--foreground", "210 40% 96%");
      root.style.setProperty("--card-foreground", "210 40% 96%");
      root.style.setProperty("--popover", "222 47% 8%");
      root.style.setProperty("--popover-foreground", "210 40% 96%");
      root.style.setProperty("--muted", "222 30% 14%");
      root.style.setProperty("--muted-foreground", "215 20% 55%");
      root.style.setProperty("--border", "222 30% 18%");
      root.style.setProperty("--input", "222 30% 15%");
      root.style.setProperty("--sidebar-foreground", "215 20% 65%");
      root.style.setProperty("--sidebar-accent", "222 30% 12%");
      root.style.setProperty("--sidebar-accent-foreground", "210 40% 96%");
      root.style.setProperty("--sidebar-border", "222 30% 12%");
    } else {
      // Apply light mode CSS vars
      Object.entries(lightModeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Apply custom accent color (overrides preset primary)
    const accentHsl = hexToHsl(settings.accentColor);
    root.style.setProperty("--primary", accentHsl);
    root.style.setProperty("--ring", accentHsl);
    root.style.setProperty("--sidebar-primary", accentHsl);
    root.style.setProperty("--border-glow", accentHsl);

    // Compact mode
    if (settings.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Motion
    if (!settings.motionEnabled) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [settings]);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        setSettings,
        branding,
        setBranding,
        presets,
        setPresets,
        activePresetId,
        setActivePresetId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
