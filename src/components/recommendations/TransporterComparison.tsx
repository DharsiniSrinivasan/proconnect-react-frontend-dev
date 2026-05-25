import { TrendingUp, Truck, Plane, Clock, Package, CheckCircle, Train, Ship, MapPin, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NeonCard } from "../ui/neon-card";
const modeIconMap: Record<string, any> = {
    Road: Truck,
    Air: Plane,
    Rail: Train,
    Sea: Ship,
    Inland: MapPin,
};
const fmt = (n: number) => n?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "—";
const currency = (n: number) => `₹${fmt(n)}`;

function getDynamicNotes(c: any, p: any, currentMode: string, proposedMode: string) {
    const notes: string[] = [];
    if (currentMode !== proposedMode) {
        notes.push(`Proposed transporter uses ${proposedMode} mode vs current ${currentMode} — cost and speed may vary`);
    }
    if (p?.avgTat < 0) {
        notes.push(`Proposed TAT shows ${p?.avgTat} days (likely a data anomaly — needs verification)`);
    }
    if (c?.totalQty > p?.totalQty) {
        notes.push(`Current transporter handles higher volume (${c?.totalQty} qty vs ${p?.totalQty} qty)`);
    } else if (p?.totalQty > c?.totalQty) {
        notes.push(`Proposed transporter handles higher volume (${p?.totalQty} qty vs ${c?.totalQty} qty)`);
    }
    if (p?.totalCost < c?.totalCost) {
        notes.push(`Switching leads to cost savings`);
    } else if (p?.totalCost > c?.totalCost) {
        notes.push(`Proposed option increases total cost`);
    }
    if (c?.otifPct !== p?.otifPct) {
        notes.push(`On-time delivery differs (${c?.otifPct}% vs ${p?.otifPct}%)`);
    }
    return notes;
}

function MetricRow({ label, current, proposed, better }: { label: string; current: string; proposed: string; better?: "current" | "proposed" | "equal" }) {
    return (
        <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0 items-center">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className={`text-sm font-semibold`}>{current}</span>
            <span className={`text-sm font-semibold`}>{proposed}</span>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, sub, variant = "default" }: { icon: any; label: string; value: string; sub?: string; variant?: "default" | "success" | "destructive" }) {
    const colorMap = { default: "text-primary", success: "text-success", destructive: "text-destructive" };
    return (
        <Card>
            <div className="flex items-start gap-3 p-4 rounded-lg">
                <div className={`mt-0.5 ${colorMap[variant]}`}><Icon className="w-5 h-5" /></div>
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-lg font-bold ${colorMap[variant]}`}>{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                </div>
            </div>
        </Card>
    );
}

interface TransporterComparisonProps {
    laneDetails: {
        lane: string;
        plant: string;
        tierType: string;
        current: { name: string; code: string; mode: string; metrics: any };
        proposed: { name: string; code: string; mode: string; metrics: any };
    };
}

export default function TransporterComparison({ laneDetails }: TransporterComparisonProps) {
    const c = laneDetails?.current?.metrics;
    const p = laneDetails?.proposed?.metrics;
    const costSaving = (c?.totalCost ?? 0) - (p?.totalCost ?? 0);
    const costSavingPct = c?.totalCost ? ((costSaving / c.totalCost) * 100).toFixed(1) : "0";
    const CurrentIcon = modeIconMap[laneDetails?.current?.mode] || Truck;
    const ProposedIcon = modeIconMap[laneDetails?.proposed?.mode] || Plane;
    return (
        <NeonCard>
            <div className="min-h-screen p-2 md:p-4 mx-auto space-y-6">

                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{laneDetails?.plant}</Badge>
                        <Badge variant="secondary" className="text-xs">{laneDetails?.tierType?.replace("_", " ")}</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <Package className="w-7 h-7 text-primary" />
                        Transporter Recommendation
                    </h1>
                    <p className="text-muted-foreground text-base flex items-center gap-2">
                        Route: <span className="font-semibold text-foreground">{laneDetails?.lane}</span>
                    </p>
                </div>

                {/* Key Insight */}
                <Card className="border-success/30 bg-success/5">
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-success shrink-0" />
                        <div>
                            <p className="font-semibold text-foreground">
                                Switching to {laneDetails?.proposed?.name} saves {currency(costSaving)} ({costSavingPct}% reduction)
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Proposed transporter delivers at ₹{fmt(p?.actualRatePerQty)}/qty — well below their budget rate of ₹{fmt(p?.budgetRatePerQty)}/qty
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={IndianRupee} label="Current Total Cost" value={currency(c?.totalCost)} variant="destructive" sub={`Overspend: ${currency(c?.overSpend)}`} />
                    <StatCard icon={IndianRupee} label="Proposed Total Cost" value={currency(p?.totalCost)} variant="success" sub={`Savings: ${currency(p?.savings)}`} />
                    <StatCard icon={Clock} label="Current TAT" value={`${c?.avgTat ?? "—"} day`} sub={`Promised: ${c?.promisedTat} day`} />
                    <StatCard icon={CheckCircle} label="On-Time Delivery" value={`${c?.otifPct}% / ${p?.otifPct}%`} variant="success" sub="Current / Proposed" />
                </div>

                {/* Side by Side */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Detailed Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metric</span>

                            {/* Current Transporter */}
                            <div className="text-start">
                                <div className="flex  gap-1.5">
                                    <CurrentIcon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current</span>
                                </div>
                                <p className="text-sm font-bold text-foreground">{laneDetails?.current?.name}</p>
                                <Badge variant="outline" className="text-[10px] mt-1">{laneDetails?.current?.mode}</Badge>
                            </div>

                            {/* Proposed Transporter */}
                            <div className="text-start">
                                <div className="flex  gap-1.5">
                                    <ProposedIcon className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Proposed</span>
                                </div>
                                <p className="text-sm font-bold text-foreground">{laneDetails?.proposed?.name}</p>
                                <Badge className="text-[10px] mt-1 bg-primary text-primary-foreground">{laneDetails?.proposed?.mode}</Badge>
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2">Cost & Rates</p>
                            <MetricRow label="Rate / Qty" current={currency(c?.actualRatePerQty)} proposed={currency(p?.actualRatePerQty)} better="equal" />
                            <MetricRow label="Budget Rate / Qty" current={currency(c?.budgetRatePerQty)} proposed={currency(p?.budgetRatePerQty)} />
                            <MetricRow label="Rate Gap" current={currency(c?.rateGap)} proposed={currency(p?.rateGap)} better="proposed" />
                            <MetricRow label="Total Cost" current={currency(c?.totalCost)} proposed={currency(p?.totalCost)} better="proposed" />
                            <MetricRow label="Total Budget Cost" current={currency(c?.rateBookCost)} proposed={currency(p?.rateBookCost)} better="proposed" />
                            <MetricRow label="Overspend" current={`${currency(c?.overSpend)} (${c?.overspendPct}%)`} proposed={`${currency(p?.overSpend)} (${p?.overspendPct}%)`} better="proposed" />
                            <MetricRow label="Savings" current={`${currency(c?.savings)} (${c?.savingsPct}%)`} proposed={`${currency(p?.savings)} (${p?.savingsPct}%)`} better="proposed" />

                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 mt-3">Unit & Delivery</p>
                            <MetricRow label="Total Quantity" current={fmt(c?.totalQty)} proposed={fmt(p?.totalQty)} better="current" />
                            <MetricRow label="Shipments" current={String(c?.shipmentCount)} proposed={String(p?.shipmentCount)} />
                            <MetricRow label="Avg TAT (days)" current={String(c?.avgTat)} proposed={String(p?.avgTat)} better="current" />
                            <MetricRow label="Promised TAT (days)" current={String(c?.promisedTat)} proposed={String(p?.promisedTat)} />
                            <MetricRow label="On-Time" current={`${c?.otifPct}%`} proposed={`${p?.otifPct}%`} better="equal" />
                        </div>
                    </CardContent>
                </Card>

                {/* Dynamic Notes */}


            </div>
        </NeonCard>
    );
}
