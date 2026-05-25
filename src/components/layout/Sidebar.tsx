import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  Database,
  Truck,
  ChevronDown,
  ChevronRight,
  Gauge,
  FolderSearch,
  LayoutList,
  Users,
  Warehouse,
  UserCog,
  ScrollText,
  Palette,
  ChartNoAxesCombined,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getStorage } from "@/utils/storage";
import { buildPermissionSet } from "@/utils/permission";
import { useUserStore } from "@/stores/userStore";
import { HelpDialog } from "../help-dialog";
interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  permission?: string;
}
interface NavGroup {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  basePath: string;
  permission?: string;
  items: NavItem[];
}
interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigationGroups: NavGroup[] = [
   {
    icon: LayoutDashboard,
    label: "New Card",
    basePath: "/newcard",
    permission: "view-dashboards",
    items: [
      {
        icon: Gauge,
        label: "Insights",
        path: "/newcard",
        permission: "view-dashboards",
      },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Dashboards",
    basePath: "/dashboard",
    permission: "view-dashboards",
    items: [
      {
        icon: Gauge,
        label: "Insights",
        path: "/dashboard",
        permission: "view-dashboards",
      },
    ],
  },
  {
    icon: LayoutDashboard,
    label: "Dashboards 2",
    basePath: "/dashboard2",
    permission: "view-dashboards",
    items: [
      {
        icon: Gauge,
        label: "Insights",
        path: "/dashboard2",
        permission: "view-dashboards",
      },
    ],
  },
  {
    icon: Database,
    label: "Data Ingestion",
    basePath: "/data",
    items: [
      {
        icon: FolderSearch,
        label: "Datasets",
        path: "/data/datasets",
      },
    ],
  },

  {
    icon: Database,
    label: "Data Ingestion2",
    basePath: "/data2",
    items: [
      {
        icon: FolderSearch,
        label: "Datasets",
        path: "/data2/datasets",
      },
    ],
  },

  {
    icon: ChartNoAxesCombined,
    label: "Forecast",
    basePath: "/forecast",
    permission: "access-forecast-dashboard",  
    items: [
      {
        icon: Gauge,
        label: "Insights",
        path: "/forecast",
        permission: "access-forecast-dashboard",
      },
    ],
  },
  {
    icon: Star,
    label: "Recommendations",
    basePath: "/list/recommendations",
    permission: "access-recommendations-dashboard",
    items: [
      {
        icon: Star,
        label: "Recommendations",
        path: "/list/recommendations", // remove :id
        permission: "access-recommendations-dashboard",
      },
    ],
  },
  {
    icon: FolderSearch,
    label: "Master Data",
    basePath: "/master-data",
    permission: "manage-master-data",
    items: [
      {
        icon: LayoutList,
        label: "Overview",
        path: "/master-data",
        permission: "access-overview",
      },
      {
        icon: Users,
        label: "Customers",
        path: "/master-data/customers",
        permission: "access-customer",
      },
      {
        icon: Warehouse,
        label: "Facilities",
        path: "/master-data/tab",
        permission: "access-facilities",
      },
      {
        icon: Truck,
        label: "Transporters",
        path: "/master-data/page",
        permission: "access-ratecard",
      },
    ],
  },
  {
    icon: FolderSearch,
    label: "Master Data2",
    basePath: "/master-data2",
    permission: "manage-master-data",
    items: [
      {
        icon: LayoutList,
        label: "Overview 2",
        path: "/master-data2",
        permission: "access-overview",
      },
    ],
    },
  {
    icon: Settings,
    label: "Admin",
    permission: "manage-users",
    basePath: "/admin",
    items: [
      {
        icon: UserCog,
        label: "Users & Roles",
        path: "/admin/users",
        permission: "manage-users",
      },
      {
        icon: ScrollText,
        label: "Audit Trail",
        path: "/admin/audit",
        permission: "monitor-real-time-audit",
      },
      {
        icon: Palette,
        label: "Appearance",
        path: "/admin/appearance",
        permission: "manage-theme",
      },
    ],
  },
];

export const Sidebar = ({ open, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { branding } = useThemeContext();
  const { logout } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { profileUser } = useUserStore();


  const permSet = useMemo(
    () => buildPermissionSet(JSON.parse(menus) || "[]"),
    [menus],
  );

  const filteredNavigationGroups = useMemo(() => {
    return navigationGroups
      .filter((group) => !group.permission || permSet.has(group.permission))
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => !item.permission || permSet.has(item.permission),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [permSet]);

  useEffect(() => {
    const updated: Record<string, boolean> = {};

    filteredNavigationGroups.forEach((group) => {
      updated[group.label] = group.items.some((item) =>
        location.pathname.startsWith(item.path),
      );
    });

    setOpenGroups(updated);
  }, [location.pathname, filteredNavigationGroups]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const [searchParams] = useSearchParams();

  const isDashboard = searchParams.get("isDashboard") === "true";
  const isItemActive = (path: string) => {
    if (path === "/newcard") {
  return location.pathname === "/newcard";
}
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    if (path === "/dashboard/strategic") {
      return location.pathname === "/dashboard/strategic";
    }
    if (path === "/master-data") {
  return location.pathname === "/master-data";
}

if (path === "/master-data2") {
  return location.pathname === "/master-data2";
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

    if (path === "/list/recommendations" && !isDashboard) {
      return location.pathname.startsWith("/recommendations") ||
        location.pathname.startsWith("/list/recommendations");
    }
    if (path === "/data/datasets" && isDashboard) {
      return location.pathname.startsWith("/recommendations")
    }
      if (path === "/data/datasets") {
  return location.pathname.startsWith("/data") && !location.pathname.startsWith("/data2");
}
if (path === "/data2/datasets") {
  return location.pathname.startsWith("/data2");
}
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isItemActive(item.path));
  };
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.appName}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-primary-foreground">
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
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded"
              style={{ color: "hsl(var(--sidebar-fg))" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {filteredNavigationGroups.map((group) => {
              const groupActive = isGroupActive(group);
              const isOpen = openGroups[group.label];

              const isSingleItem =
  group.items.length === 1 &&
  group.basePath !== "/master-data" &&
  group.basePath !== "/master-data2";
              // For single-item groups, render as direct link
              if (isSingleItem) {
                const item = group.items[0];
                const active = isItemActive(item.path);
                return (
                  <Link
                    to={item.path}
                    key={item.path}
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
                  </Link>
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
                          <Link
                            to={item?.path}
                            key={item.path}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                              active
                                ? "bg-primary/10 text-primary shadow-lg shadow-primary/10"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-4 h-4",
                                active && "text-primary",
                              )}
                            />
                            {item.label}
                            {active && (
                              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                            )}
                          </Link>
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
            <button
              onClick={() => setHelpOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
              {profileUser?.avatar ? (
                <img
                  src={
                    profileUser.avatar.startsWith("data:image")
                      ? profileUser.avatar
                      : `data:image/png;base64,${profileUser.avatar}`
                  }
                  alt={profileUser?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-primary-foreground">
                  {profileUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profileUser?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profileUser?.role || "User"}
              </p>
            </div>
          </div>
        </div>
        {/* Help Dialog */}
        <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      </aside>
    </>
  );
};
