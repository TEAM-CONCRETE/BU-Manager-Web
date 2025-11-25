import type { CompanyTopNavItem } from "@/components/features/company/company-top-nav";

export type CompanyNavDefinition = {
  id: string;
  label: string;
  segment: string;
};

export const companyNavDefinitions: CompanyNavDefinition[] = [
  { id: "dashboard", label: "기본 정보", segment: "dashboard" },
  { id: "attendance", label: "근태 관리", segment: "attendance" },
  { id: "payroll", label: "급여 관리", segment: "payroll" },
  { id: "safety", label: "안전/작업", segment: "safety" },
  { id: "employee", label: "사원 관리", segment: "employee" },
];

export function buildCompanyNavItems(siteId: string): CompanyTopNavItem[] {
  return companyNavDefinitions.map((item) => ({
    id: item.id,
    label: item.label,
    href: `/company/${siteId}/${item.segment}`,
  }));
}

export function getCompanyNavSegment(navId: string) {
  return companyNavDefinitions.find((item) => item.id === navId)?.segment ?? "dashboard";
}
