"use client";

import { KPICard } from "@/components/features/company/dashboard/kpi-card";

type SafetyKpiCardProps = {
  safetyRate: number;
  todayWarnings: number;
  incompletedEducation: number;
  completedInspections: number;
};

export function SafetyKpiCard({
  safetyRate,
  todayWarnings,
  incompletedEducation,
  completedInspections,
}: SafetyKpiCardProps) {
  return (
    <KPICard
      title="안전 현황 (KPI)"
      icon="safety"
      highlight={{
        label: "안전율",
        description: "금일 기준",
        value: `${safetyRate}%`,
        variant: "success",
      }}
      items={[
        {
          label: "금일 발생 안전 경고",
          value: `${todayWarnings}건`,
          variant: "danger",
          icon: "warning",
        },
        {
          label: "교육 미이수",
          value: `${incompletedEducation}명`,
          variant: "warning",
          icon: "graduate",
        },
        {
          label: "안전 점검 완료",
          value: `${completedInspections}건`,
          variant: "success",
          icon: "check",
        },
      ]}
    />
  );
}
