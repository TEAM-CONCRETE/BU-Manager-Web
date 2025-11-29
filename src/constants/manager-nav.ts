export type ManagerNavItem = {
  id: string;
  label: string;
  href: string;
};

export const managerNavItems: ManagerNavItem[] = [
  { id: "attendance", label: "근태 관리", href: "/manager/attendance" },
  { id: "contracts", label: "근로계약서 관리", href: "/manager/contracts" },
  { id: "employees", label: "근로자 관리", href: "/manager/employees" },
  { id: "work-daily", label: "작업일보 작성", href: "/manager/work-reports" },
  { id: "safety-education", label: "안전교육일지 작성", href: "/manager/safety-education" },
];
