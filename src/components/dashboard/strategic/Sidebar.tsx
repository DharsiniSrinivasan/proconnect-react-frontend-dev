import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  Database,
  Activity,
  IndianRupee,
  Truck,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Gauge,
  Upload,
  FolderSearch,
  Lightbulb,
  LayoutList,
  Users,
  Handshake,
  Warehouse,
  CreditCard,
  UserCog,
  ScrollText,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface NavGroup {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  basePath: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboards",
    basePath: "/dashboard",
    items: [
      { icon: Gauge, label: "Strategic", path: "/dashboard/strategic" },
      { icon: Activity, label: "Operational", path: "/dashboard/operational" },
      { icon: IndianRupee, label: "Financial", path: "/dashboard/financial" },
      {
        icon: Building2,
        label: "Facility Analytics",
        path: "/dashboard/facility-analytics",
      },
      { icon: TrendingUp, label: "Forecast Centre", path: "/forecasts" },
      {
        icon: Lightbulb,
        label: "Recommendations",
        path: "/recommendations/feed",
      },
    ],
  },
    {
      icon: LayoutDashboard,
      label: "Dashboards 2",
      basePath: "/dashboard",
      items: [
        { icon: Gauge, label: "Strategic", path: "/dashboard/strategic" },
        { icon: Activity, label: "Operational", path: "/dashboard/operational" },
        { icon: IndianRupee, label: "Financial", path: "/dashboard/financial" },
        {
          icon: Building2,
          label: "Facility Analytics",
          path: "/dashboard/facility-analytics",
        },
        { icon: TrendingUp, label: "Forecast Centre", path: "/forecasts" },
        {
          icon: Lightbulb,
          label: "Recommendations",
          path: "/recommendations/feed",
        },
      ],
    },
  {
    icon: Database,
    label: "DData & Uploads",
    basePath: "/data",
    items: [
      { icon: FolderSearch, label: "Datasets", path: "/data/datasets" },
      { icon: Upload, label: "New Upload", path: "/data/new-upload" },
    ],
  },
  {
    icon: Truck,
    label: "Data Exploration",
    basePath: "/data/shipments",
    items: [
      { icon: Truck, label: "Shipments Explorer", path: "/data/shipments" },
    ],
  },
  
  {
    icon: FolderSearch,
    label: "Master Data",
    basePath: "/master-data",
    items: [
      { icon: LayoutList, label: "Overview", path: "/master-data" },
      { icon: Users, label: "Customers", path: "/master-data/customers" },
      { icon: Handshake, label: "Partners", path: "/master-data/partners" },
      { icon: Warehouse, label: "Facilities", path: "/master-data/facilities" },
      {
        icon: CreditCard,
        label: "Rate Cards",
        path: "/master-data/rate-cards",
      },
    ],
  },
  {
    icon: Settings,
    label: "Admin",
    basePath: "/admin",
    items: [
      { icon: UserCog, label: "Users & Roles", path: "/admin/users" },
      { icon: ScrollText, label: "Audit Trail", path: "/admin/audit" },
      { icon: Palette, label: "Appearance", path: "/admin/appearance" },
    ],
  },
];

const bottomItems = [
  { icon: HelpCircle, label: "Help & Support" },
  { icon: LogOut, label: "Sign Out" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize open state for groups that contain active route
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach((group) => {
      const isGroupActive = group.items.some((item) => {
        if (item.path === "/dashboard/strategic") {
          return (
            location.pathname === "/" ||
            location.pathname === "/dashboard/strategic"
          );
        }
        if (item.path === "/master-data") {
          return location.pathname === "/master-data";
        }
        return location.pathname.startsWith(item.path);
      });
      initial[group.label] = isGroupActive;
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isItemActive = (path: string) => {
    if (path === "/dashboard/strategic") {
      return (
        location.pathname === "/" ||
        location.pathname === "/dashboard/strategic"
      );
    }
    if (path === "/master-data") {
      return location.pathname === "/master-data";
    }
    if (path === "/forecasts") {
      return (
        location.pathname === "/forecasts" ||
        location.pathname.startsWith("/forecasts/")
      );
    }
    if (path === "/recommendations/feed") {
      return location.pathname.startsWith("/recommendations");
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isItemActive(item.path));
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-primary-foreground">
              D2R
            </span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg tracking-tight">
              D2R
            </h1>
            <p className="text-xs text-muted-foreground">Direct to Retail</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationGroups.map((group) => {
            const groupActive = isGroupActive(group);
            const isOpen = openGroups[group.label];
            const isSingleItem = group.items.length === 1;

            // For single-item groups, render as direct link
            if (isSingleItem) {
              const item = group.items[0];
              const active = isItemActive(item.path);
              return (
                <button
                  key={group.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <group.icon
                    className={cn("w-5 h-5", active && "text-primary")}
                  />
                  {group.label}
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            }

            // For multi-item groups, render collapsible
            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    groupActive
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <group.icon
                    className={cn("w-5 h-5", groupActive && "text-primary")}
                  />
                  {group.label}
                  {isOpen ? (
                    <ChevronDown className="ml-auto w-4 h-4" />
                  ) : (
                    <ChevronRight className="ml-auto w-4 h-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="ml-4 pl-4 border-l border-sidebar-border/50 space-y-1 mt-1">
                    {group.items.map((item) => {
                      const active = isItemActive(item.path);
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-primary/10 text-primary shadow-lg shadow-primary/10"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon
                            className={cn("w-4 h-4", active && "text-primary")}
                          />
                          {item.label}
                          {active && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom items */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">
              AK
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Arun Kumar
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Strategy Lead
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
