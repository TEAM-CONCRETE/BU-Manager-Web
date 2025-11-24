import type { CompanyTopNavItem } from "@/components/features/company/company-top-nav";

export const companyTopNavItems: CompanyTopNavItem[] = [
  { id: "overview", label: "기본 정보", href: "/company/dashboard" },
  { id: "labor", label: "근태 관리", href: "/company/attendance" },
  { id: "payroll", label: "급여 관리", href: "/company/payroll" },
  { id: "safety", label: "안전/작업", href: "/company/safety" },
  { id: "history", label: "사원 관리", href: "/company/employees" },
];
