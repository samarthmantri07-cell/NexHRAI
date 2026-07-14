import { LayoutDashboard, Users, UserMinus, DollarSign, CalendarOff, Briefcase, UserPlus, Settings } from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Executive Overview", icon: LayoutDashboard },
  { href: "/dashboard/employee", label: "Employee Analytics", icon: Users },
  { href: "/dashboard/attrition", label: "Attrition Prediction", icon: UserMinus },
  { href: "/dashboard/salary", label: "Salary Analytics", icon: DollarSign },
  { href: "/dashboard/leave", label: "Leave Analytics", icon: CalendarOff },
  { href: "/dashboard/workforce", label: "Workforce Analytics", icon: Briefcase },
  { href: "/dashboard/recruitment", label: "Recruitment Analytics", icon: UserPlus },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
