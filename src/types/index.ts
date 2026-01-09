export type Role = "Designer" | "Content" | "Frontend";

export interface Person {
  id: string;
  name: string;
  role: Role;
  area: string;
  product?: string;
  managerName: string;
}

export interface Ship {
  id: string; // Jira ID
  title: string;
  area: string;
  product: string;
  pmNames: string[];
  targetQuarter: string;
  tshirtSizeByRole: Partial<Record<Role, "S" | "M" | "L" | "XL">>;
  status: "Planned" | "Committed" | "Backlog" | "In Review";
}

export interface Assignment {
  personId: string;
  shipId: string;
  quarter: string;
  loadPercent: number;
}

export type TShirtSize = "S" | "M" | "L" | "XL";

export interface CapacityStatus {
  level: "healthy" | "borderline" | "overloaded";
  percentage: number;
}

export interface PendingRequest {
  id: string;
  shipId: string;
  personId: string;
  requestedBy: string;
  requestedAt: Date;
  status: "pending" | "approved" | "declined";
}
