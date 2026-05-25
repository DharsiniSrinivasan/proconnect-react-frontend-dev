/**
 * Audit Trail types
 */

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

export interface AuditData {
  summary: AuditSummary;
  events: AuditEvent[];
}
