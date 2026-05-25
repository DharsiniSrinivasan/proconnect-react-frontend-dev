import KpiCards from "./KpiCards";
import NetworkOpportunities from "./NetworkOpportunities";
import RouteTable from "./RouteTable";
import SalesRecommendations from "./SalesRecommendation";
export const kpiData = [
  {
    title: "TOTAL FREIGHT (MONTHLY)",
    customer: "₹31,067",
    proconnect: "₹25,012",
    delta: "₹6,055 saved",
    deltaType: "positive" as const,
    subtitle: "Potential monthly saving",
  },
  {
    title: "AVG COST / QTY",
    customer: "₹28",
    proconnect: "₹23",
    delta: "↓ ₹5 / unit",
    deltaType: "positive" as const,
  },
  {
    title: "AVG TAT",
    customer: "4.4 days",
    proconnect: "3.0 days",
    delta: "↓ 1.4 day improvement",
    deltaType: "positive" as const,
  },
  {
    title: "ON-TIME SLA (OTIF)",
    customer: "83%",
    proconnect: "95%",
    delta: "↑ 12% improvement",
    deltaType: "positive" as const,
  },
  {
    title: "COVERAGE",
    customer: "3 regions",
    proconnect: "5 regions",
    delta: "↑ 2 additional regions",
    deltaType: "positive" as const,
  },
];

export const routeData = [
  {
    origin: "Mumbai",
    destination: "Chennai",
    product: "iPhone",
    units: 125,
    custMode: "Air",
    propMode: "Road",
    custCost: 3567,
    pcCost: 2456,
    savings: 1111,
    savingsPct: 31,
    custTAT: "4d",
    pcTAT: "3d",
    tatDelta: "↓ 1d",
  },
  {
    origin: "Hyderabad",
    destination: "Chengalpattu",
    product: "Sun Direct STB",
    units: 555,
    custMode: "Road",
    propMode: "Road",
    custCost: 10000,
    pcCost: 8456,
    savings: 1544,
    savingsPct: 15,
    custTAT: "5d",
    pcTAT: "3d",
    tatDelta: "↓ 2d",
  },
  {
    origin: "Delhi",
    destination: "Jaipur",
    product: "Samsung TV",
    units: 200,
    custMode: "Road",
    propMode: "Road",
    custCost: 5200,
    pcCost: 4100,
    savings: 1100,
    savingsPct: 21,
    custTAT: "3d",
    pcTAT: "2d",
    tatDelta: "↓ 1d",
  },
  {
    origin: "Bangalore",
    destination: "Kochi",
    product: "LG AC",
    units: 80,
    custMode: "Road",
    propMode: "Road",
    custCost: 7800,
    pcCost: 6200,
    savings: 1600,
    savingsPct: 21,
    custTAT: "4d",
    pcTAT: "3d",
    tatDelta: "↓ 1d",
  },
  {
    origin: "Pune",
    destination: "Nagpur",
    product: "Whirlpool Fridge",
    units: 150,
    custMode: "Rail",
    propMode: "Road",
    custCost: 4500,
    pcCost: 3800,
    savings: 700,
    savingsPct: 16,
    custTAT: "6d",
    pcTAT: "4d",
    tatDelta: "↓ 2d",
  },
];

export const salesRecommendations = [
  {
    title: "Reduce cost on Mumbai → Chennai by 31% using Proconnect network",
    customerToday: {
      cost: "₹3,567",
      tat: "4 days",
      otif: "82%",
      mode: "Air",
      partner: "BlueDart",
    },
    withProconnect: {
      cost: "₹2,456",
      tat: "3 days",
      otif: "96%",
      saving: "₹1,111",
    },
    tags: ["Cost Optimization", "TAT Reduction", "OTIF"],
  },
  {
    title:
      "Improve TAT on Hyderabad → Chengalpattu by switching to Proconnect hub",
    customerToday: {
      cost: "₹10,000",
      tat: "5 days",
      otif: "78%",
      mode: "Road",
      partner: "Gati",
    },
    withProconnect: {
      cost: "₹8,456",
      tat: "3 days",
      otif: "94%",
      saving: "₹1,544",
    },
    tags: ["Cost Optimization", "TAT Reduction", "New Warehouse"],
  },
  {
    title: "Reduce cost on Delhi → Jaipur by 21% via consolidated route",
    customerToday: {
      cost: "₹5,200",
      tat: "3 days",
      otif: "88%",
      mode: "Road",
      partner: "Rivigo",
    },
    withProconnect: {
      cost: "₹4,100",
      tat: "2 days",
      otif: "97%",
      saving: "₹1,100",
    },
    tags: ["Cost Optimization", "TAT Reduction"],
  },
];

export const networkOpportunities = [
  {
    region: "Tamil Nadu – Chennai",
    custRate: "₹18.50",
    pcRate: "₹14.20",
    comment:
      "High inbound from Hyderabad – deploying satellite hub in Chennai reduces long-haul cost.",
  },
  {
    region: "Rajasthan – Jaipur",
    custRate: "₹26.00",
    pcRate: "₹20.50",
    comment: "Consolidation via Delhi hub brings 21% freight reduction.",
  },
  {
    region: "Maharashtra – Pune",
    custRate: "₹30.00",
    pcRate: "₹25.30",
    comment: "Cross-dock at Pune for eastbound shipments to Nagpur corridor.",
  },
];
const SalesPage = () => {
  return (
    <div className="space-y-6">
      {" "}
      {/* Tailwind adds 1.5rem gap between children */}
      <KpiCards kpiData={kpiData} />
      <RouteTable routeData={routeData} />
      <SalesRecommendations salesRecommendations={salesRecommendations} />
      <NetworkOpportunities networkOpportunities={networkOpportunities} />
    </div>
  );
};

export default SalesPage;
