"use client";

import { KPICard } from "@/components/features/company/dashboard/kpi-card";

export function SafetyKpiCard() {
  return (
    <KPICard
      title="안전 현황 (KPI)"
      icon="safety"
      highlight={{
        label: "안전율",
        description: "금일 기준",
        value: "98.5%",
        variant: "success",
      }}
      items={[
        {
          label: "금일 발생 안전 경고",
          value: "2건",
          variant: "danger",
          icon: "warning",
        },
        {
          label: "교육 미이수",
          value: "5명",
          variant: "warning",
          icon: "graduate",
        },
        {
          label: "안전 점검 완료",
          value: "95%",
          variant: "success",
          icon: "check",
        },
      ]}
    />
  );
}
