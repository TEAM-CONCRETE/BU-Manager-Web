"use client";

import { KPICard } from "@/components/features/company/dashboard/kpi-card";

export function LaborKpiCard() {
  return (
    <KPICard
      title="노무 현황 (KPI)"
      icon="contract"
      highlight={{
        label: "미결 전자계약",
        description: "처리 필요",
        value: "7건",
        variant: "danger",
      }}
      items={[
        { label: "[ 근로계약서 ] 박승희" },
        { label: "[ 근로계약서 ] 김세원" },
        { label: "[ 근로계약서 ] 문현민" },
      ]}
    />
  );
}
