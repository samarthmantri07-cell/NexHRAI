import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface KpiData {
  id: string;
  title: string;
  value: string | number;
  trend?: number;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  attritionRisk: "Low" | "Medium" | "High";
  joinDate: string;
  salary: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "chart" | "kpi" | "table" | "custom";
  span: 1 | 2 | 3;
}

export interface PredictionFactor {
  feature: string;
  impact: number;
}

export interface PredictionResponse {
  id: string;
  employeeId: string;
  prediction: string;
  probability: number;
  confidence: number;
  riskLevel: "Low" | "Medium" | "High";
  riskFactors: PredictionFactor[];
  retentionFactors: PredictionFactor[];
  recommendations: string[];
  modelUsed: string;
  createdAt: string;
}

export interface PredictionDashboardStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}
