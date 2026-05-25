import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";

import {
    TrendingUp,
    TrendingDown,
    Gauge,
    Users,
    Database,
    AlertTriangle,
    AlertOctagon,
    InfoIcon,
    Lightbulb,
    Upload,
    Handshake,
    Building2,
    CreditCard,
    MessageSquare,
    Activity,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { useDashboardStore } from "@/stores/dashboardStore2";
import { useTilesStore } from "@/stores/masterStore";

import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";


// =====================================================
// TYPES
// =====================================================

interface Alert {
    id: string;
    title: string;
    description: string;
    priority: string;
    type: string;
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: { value: string; isPositive: boolean } | null;
    color?: "primary" | "success" | "warning";
    index: number;
}

interface Partner {
    partner_id?: number;
    name?: string;
    lane_count?: number;
    transport_mode?: string;
}

interface PartnerHealthListProps {
    topPartners?: Partner[];
}

// =====================================================
// SKELETON
// =====================================================

const AlertSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-card/50">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
            </div>
        ))}
    </div>
);

const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <div className="space-y-3 animate-pulse">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
            </div>
        ))}
    </div>
);

const GridSkeleton = ({ cols = 2 }: { cols?: number }) => (
    <div className={`grid grid-cols-${cols} gap-4 animate-pulse`}>
        {[...Array(cols === 2 ? 2 : 4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-card/50 space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
            </div>
        ))}
    </div>
);

const ActivityItem = ({
    event,
    index,
}: {
    event: any | null | undefined;
    index: number;
}) => {
    if (!event) return null;

    const actionConfig: Record<
        string,
        { icon: React.ElementType; color: string }
    > = {
        Upload: { icon: Upload, color: "text-chart-2" },
        "Master Edit": { icon: Database, color: "text-chart-4" },
        "Recommendation Decision": { icon: Lightbulb, color: "text-primary" },
        "AI Chat": { icon: MessageSquare, color: "text-chart-5" },
        Login: { icon: Users, color: "text-muted-foreground" },
    };

    const config = actionConfig[event.action ?? ""] || {
        icon: Activity,
        color: "text-muted-foreground",
    };
    const Icon = config.icon;

    return (
        <div
            className="flex items-start gap-3 py-2.5 border-b border-border/20 last:border-0 animate-fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className={cn("p-1.5 rounded-md bg-card/50", config.color)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-1">
                    {(() => {
                        try {
                            const parsed =
                                typeof event.details === "string"
                                    ? JSON.parse(event.details)
                                    : event.details;

                            return parsed?.message ?? "No details";
                        } catch {
                            return "No details";
                        }
                    })()}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                        {event.user ?? "Unknown user"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">•</span>
                    <span className="text-xs text-muted-foreground/70">
                        {event.created_date
                            ? new Date(event.created_date).toLocaleString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })
                            : "--"}
                    </span>
                </div>
            </div>
        </div>
    );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color = "primary",
    index,
}: StatCardProps) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        success: "bg-green-500/10 text-green-500",
        warning: "bg-yellow-500/10 text-yellow-500",
    };

    return (
        <div
            // className="glass-card rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            // className=" rounded-2xl p-6 rounded-2xl hover:bg-primary/5 transition-colors cursor-pointer"
            className="flex flex-col gap-6 p-7 rounded-lg bg-card/50 border border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-2xl", colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>

                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            trend.isPositive ? "text-green-500" : "text-orange-500"
                        )}
                    >
                        {trend.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}

                        {trend.value}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-5xl font-bold text-foreground">{value}</h2>

                <p className="text-muted-foreground mt-2 text-lg">{label}</p>
            </div>
        </div>
    );
};

// =====================================================
// ALERT LEGEND
// =====================================================

const AlertLegend = () => {
    const legend = [
        {
            label: "Critical",
            icon: AlertOctagon,
            color: "text-pink-500",
        },
        {
            label: "Warning",
            icon: AlertTriangle,
            color: "text-amber-500",
        },
        {
            label: "Info",
            icon: InfoIcon,
            color: "text-blue-500",
        },
    ];

    return (
        <div className="flex gap-4 mb-4 flex-wrap">
            {legend.map((item) => {
                const Icon = item.icon;

                return (
                    <div key={item.label} className="flex items-center gap-1">
                        <Icon className={`w-4 h-4 ${item.color}`} />

                        <span className="text-xs">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

// =====================================================
// ALERT ITEM
// =====================================================

const AlertItem = ({ alert }: { alert: Alert }) => {
    const typeColors = {
        Critical: "border-pink-500/30 bg-pink-500/10",
        Warning: "border-amber-500/30 bg-amber-500/10",
        Info: "border-blue-500/30 bg-blue-500/10",
    };

    return (
        <div
            className={cn(
                "p-3 rounded-lg border",
                typeColors[alert.priority as keyof typeof typeColors]
            )}
        >
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />

                <h4 className="text-sm font-semibold">{alert.title}</h4>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
                {alert.description}
            </p>
        </div>
    );
};

// =====================================================
// PARTNER HEALTH LIST
// =====================================================

const PartnerHealthList = ({
    topPartners = [],
}: PartnerHealthListProps) => {
    if (!topPartners.length) {
        return (
            <div className="text-sm text-muted-foreground">
                No transporter data available
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {topPartners.map((partner, i) => (
                <div
                    key={partner.partner_id || i}
                    className="flex items-center justify-between border-b border-border/20 pb-3"
                >
                    <div>
                        <p className="font-medium">{partner.name}</p>

                        <p className="text-xs text-muted-foreground">
                            {partner.lane_count} lanes • {partner.transport_mode}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};


// =====================================================
// MAIN PAGE
// =====================================================

const GenericDashboardPage2 = () => {
    const navigate = useNavigate();

    const {
        fetchDashboardSummary: fetchDashboardSummary,
        fetchAlerts,
        fetchPartnerHealth,
        fetchAudits,
        summary,
        alerts,
        partnerHealth,
        audits,
    } = useDashboardStore(); 

    const { fetchTiles, data } = useTilesStore();

    const storage = getStorage();

    const menus = storage.getItem("menus");

    const { hasPermission } = usePermission(JSON.parse(menus || "[]"));

    const customerCount =
        data?.find((item) => item.id === "customers")?.count || 0;

    useEffect(() => {
        fetchDashboardSummary();
        fetchAlerts();
        fetchPartnerHealth();

        if (hasPermission("manage-master-data")) {
            fetchTiles();
        }

        if (hasPermission("monitor-real-time-audit")) {
      fetchAudits(
        0,
        5,
        "all",
        "all",
        "all",
        "all",
        null,
        "timestamp",
        "Z_TO_A",
      );
    }

    }, []);

    if (!summary) {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <AppShell
            pageTitle="Insights Dashboard"
            pageSubtitle="System Overview"
            lastUpdated={new Date().toISOString()}
        >
            {/* TOP CARDS */}
      
            <section className="grid grid-cols-0 md:grid-cols-0 lg:grid-cols-5 gap-0">
                
                {hasPermission("manage-users") && (
                    <StatCard
                        icon={Users}
                        label="Active Users"
                        value={summary?.users?.active_total ?? 0}
                        color="primary"
                        index={0}
                    />
                )}

                <StatCard
                    icon={Database}
                    label="Total Batches"
                    value={summary?.batches?.total ?? 0}
                    trend={{
                        value: `${summary?.batches?.this_week_added ?? 0} This week`,
                        isPositive: summary?.batches?.isPositive ?? true,
                    }}
                    color="success"
                    index={1}
                />

                <StatCard
                    icon={Gauge}
                    label="Avg Data Quality"
                    value={`${summary?.avg_data_quality?.percentage ?? 0}%`}
                    color={
                        Number(summary?.avg_data_quality?.percentage ?? 0) >= 85
                            ? "success"
                            : "warning"
                    }
                    index={2}
                />

                <StatCard
                    icon={Users}
                    label="Total Customers"
                    value={customerCount}
                    color="primary"
                    index={3}
                />

                <StatCard
                        icon={Users}
                        label="Active Users"
                        value={summary?.users?.active_total ?? 0}
                        color="primary"
                        index={0}
                    />
            </section>

            {/* ALERTS + TRANSPORTERS */}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* ALERTS */}

                <NeonCard title="Active Alerts">
                    <p className="text-xs text-muted-foreground mt-4 mb-3">
                        Current operational alerts requiring attention.
                    </p>

                    <AlertLegend />

                    {alerts === undefined || alerts === null ? (
                        <AlertSkeleton />
                    ) : !Array.isArray(alerts) || alerts.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No alerts available
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {(alerts || []).map((alert: Alert) => (
                                <AlertItem key={alert.id} alert={alert} />
                            ))}
                        </div>
                    )}
                </NeonCard>
                <NeonCard
                    title="Transporters Health"
                    className="animate-fade-in"
                    style={{ animationDelay: "550ms" }}
                >
                    <p className="text-xs text-muted-foreground mt-4 mb-2">
                        A concise assessment of transporter performance, reliability, and
                        operational efficiency.
                    </p>
                    {partnerHealth === undefined || partnerHealth === null ? (
                        <ListSkeleton rows={3} />
                    ) : !Array.isArray(partnerHealth) || partnerHealth.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center p-4 mt-12">
                            No transporter data available
                        </div>
                    ) : (
                        <>
                            <PartnerHealthList topPartners={partnerHealth} />

                        </>
                    )}
                </NeonCard>

                <NeonCard
                    title="Master Data Overview"
                    className="animate-fade-in"
                    style={{ animationDelay: "700ms" }}
                >
                    <p className="text-xs text-muted-foreground mt-4 mb-2">
                        Unified view of customer, transporter, facility, and rate card
                        master data ensuring accuracy and consistency.
                    </p>
                    {data === undefined || data === null ? (
                        <GridSkeleton cols={1} />
                    ) : !Array.isArray(data) || data.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No master data available
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {data.map((tile, i) => {
                                const iconMap: Record<string, React.ElementType> = {
                                    Users: Users,
                                    Handshake: Handshake,
                                    Building2: Building2,
                                    CreditCard: CreditCard,
                                };
                                const Icon = iconMap[tile.icon] || Database;

                                return (
                                    <div
                                        key={tile.id}
                                        role="button"
                                        tabIndex={0}
                                        className="p-4 rounded-lg bg-card/50 border border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"

                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-foreground">
                                                    {tile.count.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {tile.label}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </NeonCard>

                <NeonCard
                            title="Recent Activity"
                            className="animate-fade-in"
                            style={{ animationDelay: "650ms" }}
                          >
                            <p className="text-xs text-muted-foreground mt-4 mb-2">
                              Latest audit logs and compliance updates across operations
                            </p>
                            {audits === undefined || audits === null ? (
                              <ListSkeleton rows={5} />
                            ) : !Array.isArray(audits) || audits.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No activity data available
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {audits.map((event, i) => (
                                  <ActivityItem key={event.audit_id} event={event} index={i} />
                                ))}
                              </div>
                            )}
                            
                          </NeonCard>
            </section>
        </AppShell>
    );
};

export default GenericDashboardPage2;