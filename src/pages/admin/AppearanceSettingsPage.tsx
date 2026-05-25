import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import {
  useThemeContext,
  ThemePreset,
  ThemePresetDefinition,
  getPresetPreviewColors,
  ThemeMode,
} from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Save,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppearanceStore } from "@/stores/appearanceStore";

const basePresets: {
  id: ThemePreset;
  name: string;
  colors: { bg: string; accent: string; sidebar: string };
}[] = [
  {
    id: "NEO_DARK",
    name: "Neo Dark",
    colors: { bg: "#0d1117", accent: "#22d3ee", sidebar: "#0a0d12" },
  },
  {
    id: "NEO_PURPLE",
    name: "Neo Purple",
    colors: { bg: "#14101f", accent: "#a855f7", sidebar: "#100c18" },
  },
  {
    id: "NEO_CYAN",
    name: "Neo Cyan",
    colors: { bg: "#0a1418", accent: "#06b6d4", sidebar: "#081012" },
  },
];

const SYSTEM_PRESET_IDS = [
  "neo-dark-system",
  "neo-purple-system",
  "neo-cyan-system",
];

// Add system presets array
const systemPresets: ThemePresetDefinition[] = [
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

// Custom accent colors (not theme preset colors)
const customAccentColors = [
  { name: "Blue", hex: "#3b82f6" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Lime", hex: "#84cc16" },
  { name: "Green", hex: "#10b981" },
  { name: "Emerald", hex: "#059669" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Fuchsia", hex: "#d946ef" },
];

export default function AppearanceSettingsPage() {
  const {
    settings,
    setSettings,
    branding,
    setBranding,
    presets,
    setPresets,
    activePresetId,
    setActivePresetId,
  } = useThemeContext();

  const [newPresetName, setNewPresetName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [savingPresetId, setSavingPresetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    fetchAppearance,
    saveAppearance,
    data,
    image,
    fetchLogoImage,
    saveLogoImage,
  } = useAppearanceStore();

  // Track if settings have been modified from active preset
  const [isModified, setIsModified] = useState(false);

  // Check if current settings match active preset
  useEffect(() => {
    if (activePresetId) {
      const activePreset = presets.find((p) => p.id === activePresetId);
      if (activePreset) {
        const settingsMatch =
          settings.accentColor === activePreset.settings.accentColor &&
          settings.compactMode === activePreset.settings.compactMode &&
          settings.motionEnabled === activePreset.settings.motionEnabled &&
          settings.themeMode === activePreset.settings.themeMode &&
          settings.preset === activePreset.settings.preset;

        setIsModified(!settingsMatch);
      } else {
        setIsModified(true);
      }
    } else {
      setIsModified(true);
    }
  }, [settings, activePresetId, presets]);

  // Default preset configuration - use neo-dark-system as default
  const getDefaultPreset = () => ({
    ...systemPresets[0], // Use neo-dark-system as default
    isActive: true,
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLogoImage(), fetchAppearance()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Load all data from API response
  useEffect(() => {
    if (!data) return;

    let allPresets = data.map((item: any, index: number) => ({
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

    // If no presets exist, initialize with default Neo Dark
    if (allPresets.length === 0) {
      const defaultPreset = getDefaultPreset();
      allPresets = [defaultPreset];
      setSettings(defaultPreset.settings);
      setActivePresetId(defaultPreset.id);
    } else {
      // Find and apply active preset
      const activePreset = allPresets.find((p: any) => p.isActive);
      if (activePreset) {
        setActivePresetId(activePreset.id);
        setSettings(activePreset.settings);
      } else {
        // No active preset, apply default neo-dark-system
        const defaultPreset = getDefaultPreset();
        setSettings(defaultPreset.settings);
        setActivePresetId(defaultPreset.id);

        // Update the first preset to be active
        allPresets = allPresets.map((p: any, index: number) => ({
          ...p,
          isActive: index === 0,
        }));
      }
    }

    // Set presets (includes both system and user presets)
    setPresets(allPresets);

    // Load branding from the first preset's brand data (or use first preset)
    const brandData = data[0]?.brand;
    if (brandData) {
      setBranding({
        appName: brandData.name || "D2R",
        tagline: brandData.tagLine || "Direct to Retail",
        logoUrl: normalizeBase64Image(image) || null,
      });
    }
  }, [data]);

  // Load logo from API
  useEffect(() => {
    if (image) {
      setBranding({
        ...branding,
        logoUrl: normalizeBase64Image(image) || null,
      });
    }
  }, [image]);

  // Save all data to API
  const saveData = async (updatedPresets?: any[], id?: any) => {
    const presetsToSave = updatedPresets || presets;
    const formattedPresets = presetsToSave.map((preset) => ({
      id: preset.id,
      name: preset.name,
      isActive: preset.id === (id ?? activePresetId),
      isSystem: preset.isSystem || false,
      settings: {
        preset: preset.settings.preset,
        themeMode: preset.settings.themeMode,
        accentColor: preset.settings.accentColor,
        compactMode: preset.settings.compactMode,
        motionEnabled: preset.settings.motionEnabled,
      },
      brand: {
        logoImage: "",
        name: branding.appName,
        tagLine: branding.tagline,
      },
    }));

    const success = await saveAppearance(formattedPresets);
    fetchLogoImage();

    if (success) {
      toast({
        title: "Success",
        description: "Appearance updated successfully",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save appearance",
        variant: "destructive",
      });
    }

    return success;
  };

  const handlePresetChange = async (presetId: ThemePreset) => {

    // Safety check: ensure presets array is not empty
    if (presets.length === 0) {
      const defaultPreset = getDefaultPreset();
      setPresets([defaultPreset]);
      setSettings(defaultPreset.settings);
      setActivePresetId(defaultPreset.id);
      await saveData([defaultPreset]);

      toast({
        title: "Preset restored",
        description: "Default Neo Dark preset has been applied",
        variant: "default",
      });
      return;
    }

    const preset = basePresets.find((p) => p.id === presetId);
    if (!preset) return;

    const newSettings = {
      ...settings,
      preset: presetId,
      accentColor: preset.colors.accent,
    };

    setSettings(newSettings);
    setIsModified(false);

    // Find system preset with matching preset ID from the local systemPresets array
    const systemPreset = systemPresets.find(
      (p) => p.isSystem && p.settings.preset === presetId,
    );

    // If no system preset found, use the default neo-dark-system
    const newActiveId = systemPreset?.id || systemPresets[0].id;
    setActivePresetId(newActiveId);

    // Update presets in context to reflect the active state
    const allPresets = [...systemPresets, ...userPresets];
    const updatedPresets = allPresets.map((p) => ({
      ...p,
      isActive: p.id === newActiveId,
      settings: p.id === newActiveId ? newSettings : p.settings,
    }));

    setPresets(updatedPresets);
    await saveData(updatedPresets, newActiveId);
  };

  const handleThemeModeToggle = async (mode: ThemeMode) => {
    const newSettings = { ...settings, themeMode: mode };
    setSettings(newSettings);

    // If there's an active preset, update its theme mode while keeping it active
    if (activePresetId) {
      const updatedPresets = presets.map((p) => {
        if (p.id === activePresetId) {
          return {
            ...p,
            settings: {
              ...p.settings,
              themeMode: mode,
            },
          };
        }
        return p;
      });

      setPresets(updatedPresets);

      // Save the updated presets to backend
      await saveData(updatedPresets, activePresetId);
    } else {
      // No active preset, so this becomes a custom modification
      setIsModified(true);

      // Update all presets to not be active
      const updatedPresets = presets.map((p) => ({
        ...p,
        isActive: false,
      }));

      await saveData(updatedPresets);
    }
  };

  const handleAccentChange = async (hex: string) => {
    const newSettings = { ...settings, accentColor: hex };
    setSettings(newSettings);

    // If there's an active preset, update its accent color while keeping it active
    if (activePresetId) {
      const updatedPresets = presets.map((p) => {
        if (p.id === activePresetId) {
          return {
            ...p,
            settings: {
              ...p.settings,
              accentColor: hex,
            },
          };
        }
        return p;
      });

      setPresets(updatedPresets);
      //await saveData(updatedPresets, activePresetId);
    } else {
      // No active preset, so this becomes a custom modification
      setIsModified(true);

      // Update all presets to not be active
      const updatedPresets = presets.map((p) => ({
        ...p,
        isActive: false,
      }));

      
      //await saveData(updatedPresets);
    }
  };

  const handleCompactToggle = async (checked: boolean) => {
    const newSettings = { ...settings, compactMode: checked };
    setSettings(newSettings);

    // If there's an active preset, update its compact mode while keeping it active
    if (activePresetId) {
      const updatedPresets = presets.map((p) => {
        if (p.id === activePresetId) {
          return {
            ...p,
            settings: {
              ...p.settings,
              compactMode: checked,
            },
          };
        }
        return p;
      });

      setPresets(updatedPresets);
      await saveData(updatedPresets, activePresetId);
    } else {
      // No active preset, so this becomes a custom modification
      setIsModified(true);

      // Update all presets to not be active
      const updatedPresets = presets.map((p) => ({
        ...p,
        isActive: false,
      }));

      await saveData(updatedPresets);
    }
  };

  const handleMotionToggle = async (checked: boolean) => {
    const newSettings = { ...settings, motionEnabled: checked };
    setSettings(newSettings);

    // If there's an active preset, update its motion setting while keeping it active
    if (activePresetId) {
      const updatedPresets = presets.map((p) => {
        if (p.id === activePresetId) {
          return {
            ...p,
            settings: {
              ...p.settings,
              motionEnabled: checked,
            },
          };
        }
        return p;
      });

      setPresets(updatedPresets);
      await saveData(updatedPresets, activePresetId);
    } else {
      // No active preset, so this becomes a custom modification
      setIsModified(true);

      // Update all presets to not be active
      const updatedPresets = presets.map((p) => ({
        ...p,
        isActive: false,
      }));

      await saveData(updatedPresets);
    }
  };
  const normalizeBase64Image = (base64?: string | null) => {
    if (!base64) return "";
    // Already a valid image src
    if (base64.startsWith("data:image")) return base64;
    // Default type – adjust if backend sends jpeg/webp
    return `data:image/png;base64,${base64}`;
  };

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return;

    setIsSavingPreset(true);

    try {
      // Save logo if changed
      if (branding.logoUrl?.startsWith("data:image")) {
        const formData = new FormData();
        const base64 = branding.logoUrl;
        const blob = base64ToBlob(base64);
        formData.append("file", blob, "logo.jpg");
        await saveLogoImage(formData);
      }

      const newPreset: ThemePresetDefinition = {
        id: `custom-${Date.now()}`,
        name: newPresetName.trim(),
        isActive: true,
        isSystem: false,
        settings: { ...settings },
      };

      const updatedPresets = presets.map((p) => ({ ...p, isActive: false }));
      updatedPresets.push(newPreset);

      setPresets(updatedPresets);
      setActivePresetId(newPreset.id);
      setNewPresetName("");
      setIsModified(false);
      await saveData(updatedPresets, newPreset.id);

      toast({
        title: "Preset saved",
        description: `"${newPresetName.trim()}" has been saved as a new preset`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handleApplyPreset = async (preset: ThemePresetDefinition) => {
    setSavingPresetId(preset.id);

    try {
      setSettings({ ...preset.settings });
      setActivePresetId(preset.id);
      setIsModified(false);

      const updatedPresets = presets.map((p) => ({
        ...p,
        isActive: p.id === preset.id,
      }));

      setPresets(updatedPresets);
      await saveData(updatedPresets, preset.id);
    } finally {
      setSavingPresetId(null);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    const presetToDelete = presets.find((p) => p.id === presetId);

    // Don't allow deleting system presets
    if (presetToDelete?.isSystem) {
      toast({
        title: "Cannot delete",
        description: "System presets cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    setSavingPresetId(presetId);

    try {
      const updatedPresets = presets.filter((p) => p.id !== presetId);
      setPresets(updatedPresets);

      if (activePresetId === presetId) {
        // Set neo-dark-system as default if we delete the active preset
        setActivePresetId(systemPresets[0].id);
        setSettings(systemPresets[0].settings);
        setIsModified(false);

        // Make neo-dark-system active
        const finalPresets = updatedPresets.map((p) => ({
          ...p,
          isActive: p.id === systemPresets[0].id,
        }));

        setPresets(finalPresets);
        await saveData(finalPresets);

        toast({
          title: "Preset deleted",
          description: `"${presetToDelete?.name}" has been deleted. Default theme applied.`,
          variant: "default",
        });
      } else {
        await saveData(updatedPresets);

        toast({
          title: "Preset deleted",
          description: `"${presetToDelete?.name}" has been deleted.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete preset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPresetId(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, SVG)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const logoUrl = event.target?.result as string;
      setBranding({ ...branding, logoUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    setIsSavingLogo(true);

    try {
      setBranding({ ...branding, logoUrl: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // const formData = new FormData();
      // formData.append("file", "");
      // await saveLogoImage(formData);

      // toast({
      //   title: "Logo removed",
      //   description: "Default logo has been restored",
      // });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingLogo(false);
    }
  };

  function base64ToBlob(base64: string): Blob {
    const [meta, data] = base64.split(",");
    const mime = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";

    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: mime });
  }

  const handleSave = async () => {
    setIsSavingLogo(true);

    try {
      const formData = new FormData();
      const base64 = branding.logoUrl;

      if (base64?.startsWith("data:image")) {
        const blob = base64ToBlob(base64);
        formData.append("file", blob, "logo.jpg");
        await saveLogoImage(formData);
      }

      await saveData();

      toast({
        title: "Logo updated",
        description: "Your new logo has been applied",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleAppNameChange = async (name: string) => {
    const newName = name;
    setBranding({ ...branding, appName: newName });
  };

  const handleTaglineChange = async (tagline: string) => {
    const newTagline = tagline;
    setBranding({ ...branding, tagline: newTagline });
  };

  const activePreset = presets.find((p) => p.id === activePresetId);
  const currentPresetLabel = activePreset
    ? activePreset.name
    : isModified
      ? "Custom"
      : "Neo Dark";
  const systemPresetsInList = presets.filter((p) => p.isSystem);
  const userPresets = presets.filter((p) => !p.isSystem);
  const isLightMode = settings.themeMode === "LIGHT";

  if (isLoading) {
    return (
      <AppShell
        pageTitle="Appearance & Preferences"
        pageSubtitle="Loading settings..."
        lastUpdated="Settings"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      pageTitle="Appearance & Preferences"
      pageSubtitle="Customize the D2R app theme and layout"
      lastUpdated="Settings"
    >
      {/* Active Preset Indicator */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Current Theme:</span>
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
            activePresetId
              ? "bg-primary/10 text-primary border-primary/30"
              : isModified
                ? "bg-warning/10 text-warning border-warning/30"
                : "bg-muted/50 text-muted-foreground border-border/50",
          )}
        >
          {activePresetId ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : isModified ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : null}
          {currentPresetLabel}
          <span className="text-xs opacity-60">({settings.themeMode})</span>
          {isModified && !activePresetId && (
            <span className="text-xs opacity-60 ml-1">(modified)</span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Branding / Logo Section */}

        <NeonCard title="App Branding" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground mb-6">
            Customize the app logo, name, and tagline that appears in the
            sidebar.
          </p>

          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div></div>
                {branding.logoUrl ? (
                  <div className="relative">
                    <img
                      src={branding.logoUrl}
                      alt="App Logo"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-border/50"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      disabled={isSavingLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      {isSavingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-border/50">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {branding.appName.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-[120px]">
                PNG, JPG, or SVG. Max 2MB.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name" className="text-sm font-medium">
                  App Name
                </Label>
                <Input
                  id="app-name"
                  value={branding.appName}
                  onChange={(e) => handleAppNameChange(e.target.value)}
                  onBlur={(e) => handleAppNameChange(e.target.value)}
                  placeholder="D2R"
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-sm font-medium">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={branding.tagline}
                  onChange={(e) => handleTaglineChange(e.target.value)}
                  onBlur={(e) => handleTaglineChange(e.target.value)}
                  placeholder="Direct to Retail"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="p-4 rounded-lg bg-sidebar border border-sidebar-border mt-4">
                <p className="text-xs text-muted-foreground mb-3">Preview</p>
                <div className="flex items-center gap-3">
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt="Logo preview"
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {branding.appName.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="font-bold text-foreground text-lg tracking-tight">
                      {branding.appName}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {branding.tagline}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <Button
                  onClick={handleSave}
                  disabled={isSavingLogo}
                  className="ml-auto gap-2"
                >
                  {isSavingLogo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </NeonCard>

        {/* Theme Presets */}
        <NeonCard title="Theme Presets" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground mb-4">
            Choose a base theme preset. Clicking a preset will update the color
            scheme across the entire application.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {basePresets.map((preset) => {
              const isActive = settings.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
                    isActive
                      ? "border-primary shadow-[0_0_20px_var(--primary-glow)]"
                      : "border-border/50 hover:border-primary/50",
                  )}
                  style={{ background: preset.colors.bg }}
                >
                  <div className="flex gap-2 mb-3">
                    <div
                      className="w-6 h-12 rounded"
                      style={{ background: preset.colors.sidebar }}
                    />
                    <div className="flex-1 space-y-1">
                      <div
                        className="h-2 w-3/4 rounded"
                        style={{
                          background: preset.colors.accent,
                          opacity: 0.8,
                        }}
                      />
                      <div className="h-2 w-full rounded bg-white/10" />
                      <div className="h-2 w-1/2 rounded bg-white/10" />
                    </div>
                  </div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: preset.colors.accent }}
                  >
                    {preset.name}
                  </p>
                  {isActive && (
                    <div
                      className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse"
                      style={{ background: preset.colors.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </NeonCard>

        {/* Theme Mode - Light/Dark Toggle */}
        <NeonCard title="Theme Mode" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground mb-4">
            Switch between dark and light mode. The entire interface will update
            instantly.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeModeToggle("DARK")}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300",
                  !isLightMode
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "border-border/50 hover:border-primary/50",
                )}
              >
                <Moon
                  className={cn(
                    "w-6 h-6",
                    !isLightMode ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="text-left">
                  <p
                    className={cn(
                      "font-semibold",
                      !isLightMode ? "text-primary" : "text-foreground",
                    )}
                  >
                    Dark
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Neon glassmorphism
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleThemeModeToggle("LIGHT")}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300",
                  isLightMode
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "border-border/50 hover:border-primary/50",
                )}
              >
                <Sun
                  className={cn(
                    "w-6 h-6",
                    isLightMode ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="text-left">
                  <p
                    className={cn(
                      "font-semibold",
                      isLightMode ? "text-primary" : "text-foreground",
                    )}
                  >
                    Light
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Clean and bright
                  </p>
                </div>
              </button>
            </div>
            <div
              className="flex-1 max-w-xs p-3 rounded-lg border"
              style={{
                background: isLightMode ? "#f8fafc" : "#0f172a",
                borderColor: isLightMode ? "#e2e8f0" : "#1e293b",
              }}
            >
              <div className="flex gap-2">
                <div
                  className="w-8 h-16 rounded"
                  style={{ background: isLightMode ? "#f1f5f9" : "#0a0d12" }}
                />
                <div className="flex-1 space-y-1.5">
                  <div
                    className="h-2 w-3/4 rounded"
                    style={{ background: settings.accentColor }}
                  />
                  <div
                    className="h-2 w-full rounded"
                    style={{ background: isLightMode ? "#e2e8f0" : "#1e293b" }}
                  />
                  <div
                    className="h-2 w-1/2 rounded"
                    style={{ background: isLightMode ? "#e2e8f0" : "#1e293b" }}
                  />
                </div>
              </div>
              <p
                className="text-[10px] mt-2 text-center"
                style={{ color: isLightMode ? "#64748b" : "#94a3b8" }}
              >
                Preview
              </p>
            </div>
          </div>
        </NeonCard>
        {/* Accent Color */}
        <NeonCard title="Accent Color">
          <p className="text-sm text-muted-foreground mb-4">
            Fine-tune the primary accent color used for highlights and
            interactive elements.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {customAccentColors.map((color) => {
              const isActive =
                settings.accentColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  onClick={() => handleAccentChange(color.hex)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all duration-200",
                    isActive
                      ? "border-white scale-110 shadow-[0_0_15px_var(--primary)]"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ background: color.hex }}
                  title={color.name}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <Label
              htmlFor="custom-color"
              className="text-sm text-muted-foreground"
            >
              Custom:
            </Label>
            <Input
              id="custom-color"
              type="color"
              value={settings.accentColor}
              onChange={(e) => handleAccentChange(e.target.value)}
              className="w-12 h-10 p-1 rounded cursor-pointer bg-muted border-border"
            />
            <span className="text-sm font-mono text-muted-foreground">
              {settings.accentColor.toUpperCase()}
            </span>
          </div>
        </NeonCard>

        {/* Layout Density */}
        <NeonCard title="Layout Density">
          <p className="text-sm text-muted-foreground mb-4">
            Adjust spacing and padding throughout the interface.
          </p>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">Compact Mode</p>
              <p className="text-sm text-muted-foreground">
                Reduce padding and margins for denser information display.
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={handleCompactToggle}
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-dashed border-border/50">
            <p className="text-xs text-muted-foreground">
              Current mode:{" "}
              <span className="font-semibold text-primary">
                {settings.compactMode ? "Compact" : "Comfortable"}
              </span>
            </p>
          </div>
        </NeonCard>

        {/* Motion */}
        <NeonCard title="Motion & Animations" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground mb-4">
            Control micro-animations and transition effects across the
            interface.
          </p>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-medium text-foreground">
                Enable Micro-Animations
              </p>
              <p className="text-sm text-muted-foreground">
                Includes hover effects, scale transitions, and animated
                gradients.
              </p>
            </div>
            <Switch
              checked={settings.motionEnabled}
              onCheckedChange={handleMotionToggle}
            />
          </div>
          {!settings.motionEnabled && (
            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning">
                Animations are currently disabled. Some visual feedback may be
                reduced.
              </p>
            </div>
          )}
        </NeonCard>

        {/* Saved Themes */}
        <NeonCard title="Saved Themes" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground mb-6">
            Save your current settings as a custom preset for quick access, or
            apply a saved theme.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-lg bg-muted/20 border border-dashed border-border/50">
            <div className="flex-1">
              <Label
                htmlFor="preset-name"
                className="text-sm text-muted-foreground mb-2 block"
              >
                Save current settings as a new preset:
              </Label>
              <Input
                id="preset-name"
                placeholder="My Favorite Theme"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="bg-muted/50 border-border/50"
                onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
              />
            </div>
            <Button
              onClick={handleSavePreset}
              disabled={!newPresetName.trim() || isSavingPreset}
              className="self-end gap-2"
            >
              {isSavingPreset ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preset
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {/* System Presets */}
            {/* {systemPresets.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  System Presets
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {systemPresets.map((preset) => {
                    const colors = getPresetPreviewColors(preset.settings);
                    const isActive = activePresetId === preset.id;
                    const isLoading = savingPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        disabled={isLoading}
                        className={cn(
                          "relative p-3 rounded-lg border-2 transition-all duration-300 text-left group",
                          isActive
                            ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                            : "border-border/30 hover:border-primary/50",
                          isLoading && "opacity-50 cursor-not-allowed"
                        )}
                        style={{ background: colors.bg }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg border border-white/10"
                            style={{
                              background: `linear-gradient(135deg, ${colors.accent}, ${colors.sidebar})`
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: colors.accent }}
                            >
                              {preset.name}
                            </p>
                            <p className="text-xs text-white/40">
                              {preset.settings.compactMode ? "Compact" : "Comfortable"}
                              {!preset.settings.motionEnabled && " • No motion"}
                            </p>
                          </div>
                          {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                          )}
                        </div>
                        {isActive && !isLoading && (
                          <div
                            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                            style={{ background: colors.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )} */}

            {/* User Presets */}
            {userPresets.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your Presets
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {userPresets.map((preset) => {
                    const colors = getPresetPreviewColors(preset.settings);
                    const isActive = activePresetId === preset.id;
                    const isLoading = savingPresetId === preset.id;
                    const isDeleting = savingPresetId === preset.id;

                    return (
                      <div
                        key={preset.id}
                        className={cn(
                          "relative p-3 rounded-lg border-2 transition-all duration-300 group",
                          isActive
                            ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                            : "border-border/30 hover:border-primary/50",
                          isLoading && "opacity-50",
                        )}
                        style={{ background: colors.bg }}
                      >
                        <button
                          onClick={() =>
                            !isLoading && handleApplyPreset(preset)
                          }
                          disabled={isLoading}
                          className="w-full text-left disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg border border-white/10"
                              style={{
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.sidebar})`,
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: colors.accent }}
                              >
                                {preset.name}
                              </p>
                              <p className="text-xs text-white/40">
                                {preset.settings.compactMode
                                  ? "Compact"
                                  : "Comfortable"}
                                {!preset.settings.motionEnabled &&
                                  " • No motion"}
                              </p>
                            </div>
                            {isLoading && !isDeleting && (
                              <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                            )}
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLoading) handleDeletePreset(preset.id);
                          }}
                          disabled={isLoading}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete preset"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {isActive && !isLoading && (
                          <div
                            className="absolute top-2 right-8 w-2 h-2 rounded-full animate-pulse"
                            style={{ background: colors.accent }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {userPresets.length === 0 && (
              <div className="p-6 rounded-lg border border-dashed border-border/30 text-center">
                <p className="text-sm text-muted-foreground">
                  No custom presets yet. Save your current settings above to
                  create one!
                </p>
              </div>
            )}
          </div>
        </NeonCard>
      </div>
    </AppShell>
  );
}
