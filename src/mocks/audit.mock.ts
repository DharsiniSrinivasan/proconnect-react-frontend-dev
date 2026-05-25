export type AuditAction =
  | "Upload"
  | "Master Edit"
  | "Recommendation Decision"
  | "AI Chat"
  | "Login";

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: AuditAction;
  module: string;
  objectType: string;
  objectId: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface AuditSummary {
  totalEvents: number;
  uploads: number;
  masterEdits: number;
  recoDecisions: number;
  aiChats: number;
  logins: number;
}

export interface AuditMock {
  summary: AuditSummary;
  events: AuditEvent[];
}

export const auditMock: AuditMock = {
  summary: {
    totalEvents: 1247,
    uploads: 89,
    masterEdits: 234,
    recoDecisions: 156,
    aiChats: 412,
    logins: 356,
  },
  events: [
    {
      id: "evt-001",
      timestamp: "2025-01-01 09:15:32",
      user: "Arun Kumar",
      userId: "usr-001",
      action: "Login",
      module: "Auth",
      objectType: "Session",
      objectId: "sess-a1b2c3",
      details: "User logged in from IP 192.168.1.45, Chrome/Windows",
      metadata: { ip: "192.168.1.45", browser: "Chrome", os: "Windows" },
    },
    {
      id: "evt-002",
      timestamp: "2025-01-01 09:18:45",
      user: "Arun Kumar",
      userId: "usr-001",
      action: "AI Chat",
      module: "Decision Assistant",
      objectType: "Conversation",
      objectId: "conv-x7y8z9",
      details:
        "Asked: 'What are today's top SLA risks?' - Received analysis of 5 high-risk lanes",
      metadata: {
        query: "What are today's top SLA risks?",
        responseTokens: 450,
      },
    },
    {
      id: "evt-003",
      timestamp: "2025-01-01 09:25:12",
      user: "Priya Sharma",
      userId: "usr-002",
      action: "Upload",
      module: "Data Acquisition",
      objectType: "Dataset",
      objectId: "ds-20250101-001",
      details:
        "Uploaded shipment data file: 'Jan_Week1_Shipments.csv' (12,450 records)",
      metadata: {
        fileName: "Jan_Week1_Shipments.csv",
        recordCount: 12450,
        fileSize: "4.2MB",
      },
    },
    {
      id: "evt-004",
      timestamp: "2025-01-01 09:32:00",
      user: "Rahul Verma",
      userId: "usr-003",
      action: "Master Edit",
      module: "Master Data",
      objectType: "Partner",
      objectId: "ptn-bluedart",
      details:
        "Updated rate card for BlueDart: Base rate increased from ₹45 to ₹48/kg",
      metadata: {
        field: "baseRate",
        oldValue: 45,
        newValue: 48,
        currency: "INR",
      },
    },
    {
      id: "evt-005",
      timestamp: "2025-01-01 09:45:18",
      user: "Vikram Singh",
      userId: "usr-005",
      action: "Recommendation Decision",
      module: "Recommendations",
      objectType: "Recommendation",
      objectId: "reco-shift-north",
      details:
        "Approved recommendation: 'Shift 15% volume from North Hub to West Hub'",
      metadata: { decision: "approved", impactEstimate: "₹2.3L savings/month" },
    },
    {
      id: "evt-006",
      timestamp: "2025-01-01 10:02:33",
      user: "Sneha Patel",
      userId: "usr-004",
      action: "Master Edit",
      module: "Master Data",
      objectType: "Customer",
      objectId: "cust-flipkart",
      details:
        "Added new delivery region 'Kerala-South' to Flipkart configuration",
      metadata: { field: "regions", added: "Kerala-South" },
    },
    {
      id: "evt-007",
      timestamp: "2025-01-01 10:15:00",
      user: "Priya Sharma",
      userId: "usr-002",
      action: "AI Chat",
      module: "Decision Assistant",
      objectType: "Conversation",
      objectId: "conv-m4n5o6",
      details:
        "Asked: 'Show me underutilized facilities' - Received list of 3 facilities below 60% capacity",
      metadata: {
        query: "Show me underutilized facilities",
        facilitiesFound: 3,
      },
    },
    {
      id: "evt-008",
      timestamp: "2025-01-01 10:28:45",
      user: "Arun Kumar",
      userId: "usr-001",
      action: "Recommendation Decision",
      module: "Recommendations",
      objectType: "Recommendation",
      objectId: "reco-partner-swap",
      details:
        "Rejected recommendation: 'Replace Delhivery with DTDC for East lanes' - Reason: Contract obligations",
      metadata: {
        decision: "rejected",
        reason: "Contract obligations until Q2 2025",
      },
    },
    {
      id: "evt-009",
      timestamp: "2025-01-01 10:42:12",
      user: "Rahul Verma",
      userId: "usr-003",
      action: "Upload",
      module: "Data Acquisition",
      objectType: "Dataset",
      objectId: "ds-20250101-002",
      details:
        "Uploaded cost reconciliation file: 'Dec_Cost_Recon.xlsx' (890 records)",
      metadata: {
        fileName: "Dec_Cost_Recon.xlsx",
        recordCount: 890,
        fileSize: "1.1MB",
      },
    },
    {
      id: "evt-010",
      timestamp: "2025-01-01 11:00:00",
      user: "Kiran Reddy",
      userId: "usr-007",
      action: "Login",
      module: "Auth",
      objectType: "Session",
      objectId: "sess-p9q0r1",
      details: "First-time login from mobile device, Android/Chrome",
      metadata: {
        ip: "10.0.0.88",
        browser: "Chrome",
        os: "Android",
        firstLogin: true,
      },
    },
  ],
};
