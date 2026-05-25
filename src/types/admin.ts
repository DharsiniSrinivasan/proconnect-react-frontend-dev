/**
 * Admin types for Users & Roles
 */

export type UserStatus = "active" | "inactive" | "pending";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  personas: string[];
  regions: string[];
  status: UserStatus;
  lastLogin: string;
  avatar?: string;
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
