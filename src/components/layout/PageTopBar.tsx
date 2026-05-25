import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUserStore } from "@/stores/userStore";
import { notification } from "@/services/notificationService";
import { toast } from "sonner";
import { getStorage } from "@/utils/storage";
import { websocketService } from "@/services/websocketService";
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

interface PageTopBarProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  onMenuToggle: () => void;
}
export const PageTopBar = ({
  title,
  subtitle,
  onMenuToggle,
}: PageTopBarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    fetchNotifications,
    setPageSize,
    notificationData,
    total,
    limit,
    search,
  } = useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const currentUser = useUserStore((state) => state.profileUser);
  const { getProfileUserById } = useUserStore();
  const totalRecords = total;
  const totalPages = Math.ceil(totalRecords / limit);
  const start = totalRecords === 0 ? 0 : currentPage * limit + 1;
  const end = Math.min((currentPage + 1) * limit, totalRecords);
  const storage = getStorage();
  const hasManageTheme = JSON.parse(storage.getItem("menus") || "[]").some(
    (m: any) => m.permissionFlag === "manage-theme" && m.status,
  );

  useEffect(() => {
    getProfileUserById(user?.user_id);
  }, []);
  const convertUTCtoIST = (utcDateString: string) => {
    const date = new Date(utcDateString);
    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() + istOffset);
  };
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const onPageSizeChange = (size: number) => {
    setPageSize(size);
  };
  useEffect(() => {
    fetchNotifications(currentPage, limit, false, search);
  }, [currentPage, limit]);
  const unreadCount = notificationData.filter((n) => !n.read).length;
  const handleLogout = () => {
    logout();
    websocketService.close();
    navigate("/login");
  };
  const markAsRead = async (id: string) => {
    const resposne = await notification.markNotificationRead(id);
    if (resposne.status == "success") {
      toast.success(resposne?.message);
      fetchNotifications(currentPage, limit, false, search);
    } else {
      toast.error("Unable to mark notification as read");
    }
  };
  const markAllAsRead = async () => {
    const resposne = await notification.markAllNotificationRead();
    if (resposne.status == "success") {
      toast.success(resposne?.message);
      fetchNotifications(currentPage, limit, false, search);
    } else {
      toast.error("Unable to mark notification as read");
    }
  };
  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-primary";
    }
  };
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/50 bg-background/95 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold font-display text-foreground truncate">
            {title}
            {subtitle && (
              <span className="text-muted-foreground font-normal">
                {" "}
                – {subtitle}
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted/50"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-96 p-0 glass-card border-border/50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs  hover:text-primary-foreground gap-1 h-7"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notificationData.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-border/30">
                    {notificationData
                      .filter((notif) => !notif.isRead)
                      .map((notif) => (
                        <div
                          role="button"
                          tabIndex={0}
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              markAsRead(notif.id);
                            }
                          }}
                          className="p-4 cursor-pointer transition-colors hover:bg-muted/30 bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(notif.reference_type)}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium truncate text-foreground">
                                  {notif.type}
                                </p>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notif.type === "Masters"
                                  ? notif.description
                                  : notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-1">
                                {notif.createdAt
                                  ? new Date(
                                      convertUTCtoIST(notif.createdAt),
                                    ).toLocaleString("en-IN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit", // optional
                                      hour12: true, // 12-hour format with AM/PM
                                    })
                                  : "--"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {notificationData.length > 10 && (
                    <div className="flex items-center justify-between mt-4 pt-4 m-2 border-t border-border/30">
                      {/* Rows per page */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Rows per page:
                        </span>
                        <select
                          className="border rounded px-2 py-1 text-xs bg-background"
                          value={limit}
                          onChange={(e) => {
                            onPageSizeChange(Number(e.target.value));
                            onPageChange(0);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={500}>500</option>
                        </select>
                      </div>
                      {/* Range */}
                      <p className="text-xs text-muted-foreground">
                        {start}–{end} of {totalRecords}
                      </p>
                      {/* Nav */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          disabled={currentPage === 0}
                          onClick={() => onPageChange(currentPage - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-xs px-2">
                          {currentPage + 1} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          disabled={currentPage + 1 >= totalPages}
                          onClick={() => onPageChange(currentPage + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-muted/50 px-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                {currentUser?.avatar ? (
                  <img
                    src={
                      currentUser.avatar.startsWith("data:image")
                        ? currentUser.avatar
                        : `data:image/png;base64,${currentUser.avatar}`
                    }
                    alt={currentUser?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary-foreground">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">
                  {currentUser?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentUser?.role || "User"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass-card border-border/50"
          >
            <DropdownMenuLabel className="font-normal max-w-[200px] sm:max-w-[240px]">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground truncate">
      {currentUser?.name}
    </p>
                <p className="text-xs text-muted-foreground truncate">
      {currentUser?.email}
    </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              className="cursor-pointer   focus:bg-muted/50
             hover:bg-muted/50
             group"
              onClick={() => navigate("/admin/profile")}
            >
              <User className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                Profile
              </span>
            </DropdownMenuItem>
            {hasManageTheme && (
              <DropdownMenuItem
                className="cursor-pointer focus:bg-muted/50 hover:text-foreground group"
                onClick={() => navigate("/admin/appearance")}
              >
                <Settings className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                  Settings
                </span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
