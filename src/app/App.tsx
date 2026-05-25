/*
================================================================================
D2R - Direct to Retailer Analytics Platform
================================================================================
[Architecture documentation omitted for brevity]
*/

import { Suspense, useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider, useThemeContext } from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import { routes } from "@/app/routes";
import { useAppearanceStore } from "@/stores/appearanceStore";
import { getStorage } from "@/utils/storage";

// Loading fallback for lazy-loaded routes
export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const SYSTEM_PRESET_IDS = [
  "neo-dark-system",
  "neo-purple-system",
  "neo-cyan-system",
];

const systemPresets: any[] = [
  {
    id: "neo-dark-system",
    name: "Neo Dark",
    isSystem: true,
    settings: {
      preset: "NEO_DARK",
      themeMode: "DARK",
      accentColor: "#22d3ee",
      compactMode: false,
      motionEnabled: true,
    },
    isActive: false,
  },
  {
    id: "neo-purple-system",
    name: "Neo Purple",
    isSystem: true,
    settings: {
      preset: "NEO_PURPLE",
      themeMode: "DARK",
      accentColor: "#a855f7",
      compactMode: false,
      motionEnabled: true,
    },
    isActive: false,
  },
  {
    id: "neo-cyan-system",
    name: "Neo Cyan",
    isSystem: true,
    settings: {
      preset: "NEO_CYAN",
      themeMode: "DARK",
      accentColor: "#06b6d4",
      compactMode: false,
      motionEnabled: true,
    },
    isActive: false,
  },
];

const normalizeBase64Image = (base64?: string | null) => {
  if (!base64) return "";
  if (base64.startsWith("data:image")) return base64;
  return `data:image/png;base64,${base64}`;
};

// Router component that uses the centralized routes
function AppRoutes() {
  const [isReady, setIsReady] = useState(false);
  const { fetchAppearance, data, image, fetchLogoImage } = useAppearanceStore();
  const storage = getStorage();
  const { setSettings, branding, setBranding, setPresets, setActivePresetId } =
    useThemeContext();

  const getDefaultPreset = () => ({
    ...systemPresets[0],
    isActive: true,
  });

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchLogoImage(), fetchAppearance()]);
      } catch (error) {
        console.error("Failed to load appearance data:", error);
        // Even on error, proceed with defaults
      }
    };
    loadData();
  }, [fetchLogoImage, fetchAppearance]);

  // Process API data and set theme
  useEffect(() => {
    if (!data) return;

    let allPresets = data?.map((item: any, index: number) => ({
      id: item.id || `preset-${index}`,
      name: item.name || `Preset ${index + 1}`,
      isActive: item.isActive,
      isSystem: SYSTEM_PRESET_IDS.includes(item.id),
      settings: {
        preset: item.settings?.preset || "NEO_DARK",
        themeMode: item.settings?.themeMode || "DARK",
        accentColor: item.settings?.accentColor || "#22d3ee",
        compactMode: item.settings?.compactMode || false,
        motionEnabled: item.settings?.motionEnabled !== false,
      },
    }));

    if (allPresets.length === 0) {
      const defaultPreset = getDefaultPreset();
      allPresets = [defaultPreset];
      setSettings(defaultPreset.settings);
      setActivePresetId(defaultPreset.id);
    } else {
      const activePreset = allPresets.find((p: any) => p.isActive);
      if (activePreset) {
        setActivePresetId(activePreset.id);
        setSettings(activePreset.settings);
        storage.setItem("themeMode", activePreset.settings.themeMode);
      } else {
        const defaultPreset = getDefaultPreset();
        setSettings(defaultPreset.settings);
        setActivePresetId(defaultPreset.id);
        allPresets = allPresets?.map((p: any, index: number) => ({
          ...p,
          isActive: index === 0,
        }));
      }
    }

    setPresets(allPresets);

    const brandData = data[0]?.brand;
    if (brandData) {
      setBranding({
        appName: brandData.name || "D2R",
        tagline: brandData.tagLine || "Direct to Retail",
        logoUrl: normalizeBase64Image(image) || null,
      });
    }

    // Mark as ready after theme is set
    setIsReady(true);
  }, [data, image, setSettings, setActivePresetId, setPresets, setBranding]);

  // Update logo when image changes
  useEffect(() => {
    if (image && isReady) {
      setBranding({
        ...branding,
        logoUrl: normalizeBase64Image(image) || null,
      });
    }
  }, [image, isReady]);

  const element = useRoutes(routes);

  // Show loader until everything is ready
  if (!isReady) {
    return <PageLoader />;
  }

  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
