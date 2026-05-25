type Role = {
  key: string;
  value: string;
};

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  personas: string[];
  regions: string[];
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  profileImage?: null;
}

export interface RoleAccess {
  id: string;
  roleName: string;
  description: string;
  moduleAccess: string[];
  screenAccess: string[];
  rowScope: string;
  isKey: boolean;
}

export const adminUsersMock: UserRow[] = [
  {
    id: "usr-001",
    name: "Arun Kumar",
    email: "arun.kumar@d2r.com",
    role: "Admin",
    personas: ["Strategy Lead", "Operations"],
    regions: ["All Regions"],
    status: "active",
    lastLogin: "2025-01-01 09:15:00",
  },
  {
    id: "usr-002",
    name: "Priya Sharma",
    email: "priya.sharma@d2r.com",
    role: "Ops",
    personas: ["Operations Manager"],
    regions: ["North", "West"],
    status: "active",
    lastLogin: "2025-01-01 08:45:00",
  },
  {
    id: "usr-003",
    name: "Rahul Verma",
    email: "rahul.verma@d2r.com",
    role: "Finance",
    personas: ["Finance Analyst"],
    regions: ["All Regions"],
    status: "active",
    lastLogin: "2024-12-31 17:30:00",
  },
  {
    id: "usr-004",
    name: "Sneha Patel",
    email: "sneha.patel@d2r.com",
    role: "Sales",
    personas: ["Regional Sales Lead"],
    regions: ["South", "East"],
    status: "active",
    lastLogin: "2025-01-01 07:20:00",
  },
  {
    id: "usr-005",
    name: "Vikram Singh",
    email: "vikram.singh@d2r.com",
    role: "Mgmt",
    personas: ["VP Operations"],
    regions: ["All Regions"],
    status: "active",
    lastLogin: "2024-12-30 14:00:00",
  },
  {
    id: "usr-006",
    name: "Anita Desai",
    email: "anita.desai@d2r.com",
    role: "Customer",
    personas: ["Customer Success"],
    regions: ["West"],
    status: "inactive",
    lastLogin: "2024-12-15 11:45:00",
  },
  {
    id: "usr-007",
    name: "Kiran Reddy",
    email: "kiran.reddy@d2r.com",
    role: "Ops",
    personas: ["Warehouse Manager"],
    regions: ["South"],
    status: "pending",
    lastLogin: "-",
  },
];

export const adminRolesMock: RoleAccess[] = [
  {
    id: "role-001",
    roleName: "Admin",
    description: "Full system access with user management capabilities",
    moduleAccess: [
      "Dashboards",
      "Data",
      "Forecasts",
      "Recommendations",
      "Master Data",
      "Admin",
    ],
    screenAccess: ["All Screens"],
    rowScope: "All Regions",
    isKey: true,
  },
  {
    id: "role-002",
    roleName: "Ops",
    description: "Operational dashboards and shipment management",
    moduleAccess: ["Dashboards", "Data", "Recommendations"],
    screenAccess: ["Operational", "Shipments", "Reco Feed"],
    rowScope: "Assigned Regions",
    isKey: true,
  },
  {
    id: "role-003",
    roleName: "Mgmt",
    description: "Strategic oversight and decision approval",
    moduleAccess: ["Dashboards", "Forecasts", "Recommendations"],
    screenAccess: ["Strategic", "Financial", "Forecast Centre", "Reco Feed"],
    rowScope: "All Regions",
    isKey: true,
  },
  {
    id: "role-004",
    roleName: "Finance",
    description: "Financial analytics and cost management",
    moduleAccess: ["Dashboards", "Forecasts", "Master Data"],
    screenAccess: ["Financial", "Cost Forecast", "Rate Cards"],
    rowScope: "All Regions",
    isKey: true,
  },
  {
    id: "role-005",
    roleName: "Sales",
    description: "Customer and partner relationship management",
    moduleAccess: ["Dashboards", "Master Data"],
    screenAccess: ["Strategic", "Customers", "Partners"],
    rowScope: "Assigned Regions",
    isKey: true,
  },
  {
    id: "role-006",
    roleName: "Customer",
    description: "Limited customer-facing portal access",
    moduleAccess: ["Dashboards"],
    screenAccess: ["Customer Portal"],
    rowScope: "Own Data Only",
    isKey: true,
  },
];

export const availablePersonas = [
  "Strategy Lead",
  "Operations Manager",
  "Finance Analyst",
  "Regional Sales Lead",
  "VP Operations",
  "Customer Success",
  "Warehouse Manager",
  "Data Analyst",
  "Partner Manager",
];

export const availableRegions = [
  "All Regions",
  "North",
  "South",
  "East",
  "West",
  "Central",
];
