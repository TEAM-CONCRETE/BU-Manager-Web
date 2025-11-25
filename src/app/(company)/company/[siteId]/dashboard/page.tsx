"use client";

import { useMemo } from "react";

import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import { OverviewCard } from "@/components/features/company/dashboard/overview-card";
import { WorkforceCard } from "@/components/features/company/dashboard/workforce-card";
import { LaborKpiCard } from "@/components/features/company/dashboard/labor-kpi-card";
import { SafetyKpiCard } from "@/components/features/company/dashboard/safety-kpi-card";
import { ScheduleCard } from "@/components/features/company/dashboard/schedule-card";
import { AlertCenterCard } from "@/components/features/company/dashboard/alert-center-card";
import type { StatusPillProps } from "@/components/ui/StatusPill/status-pill";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  variant: StatusPillProps["variant"];
};

const scheduleItems = [
  {
    id: "schedule-1",
    title: "이천 A현장 콘크리트 타설",
    date: "3월 28일 (목)",
    owner: "현장총괄 / 박소연",
  },
  {
    id: "schedule-2",
    title: "포천 D현장 협력업체 킥오프",
    date: "3월 29일 (금)",
    owner: "구매팀 / 장우석",
  },
  {
    id: "schedule-3",
    title: "본사-현장 통합 운영 리뷰",
    date: "4월 1일 (월)",
    owner: "운영기획팀",
  },
];

const alertItems: ActivityItem[] = [
  {
    id: "alert-1",
    title: "용인 B 현장 안전패트롤 경고",
    description: "안전모 미착용 3건, 작업자 교육 필요",
    timestamp: "10분 전",
    variant: "danger",
  },
  {
    id: "alert-2",
    title: "세종 정부청사 현장 예산 초과",
    description: "예산 대비 12% 초과 사용, 승인 대기",
    timestamp: "1시간 전",
    variant: "warning",
  },
  {
    id: "alert-3",
    title: "부산 스마트팩토리 품질 검사 완료",
    description: "외관/내부 검사 통과, 승인 처리 필요",
    timestamp: "어제",
    variant: "success",
  },
];

type Props = {
  params: {
    siteId: string;
  };
};

export default function CompanyDashboardPage({ params }: Props) {
  const { data } = useCompanySites();
  const sites = useMemo(() => data?.sites ?? [], [data]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  return (
    <div className="min-h-full bg-bg-page px-4 py-6 dark:bg-dark-bg-page sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CompanyTopNav items={navItems} defaultActiveId="dashboard" />
          <header>
            <h1 className="mb-0! text-3xl font-bold! text-text-strong dark:text-dark-text-strong">
              {currentSite?.siteName ?? "현장 이름을 불러오는 중..."}
            </h1>
            <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
              {currentSite?.siteAddress ?? "현장 운영 현황을 한눈에 확인하세요"}
            </p>
          </header>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <OverviewCard
            client="이천시청"
            startDate="2024.03.15"
            endDate="2025.12.30"
            progress={68}
          />
          <WorkforceCard total={142} salaried={89} daily={53} attendanceToday={127} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <LaborKpiCard />
          <SafetyKpiCard />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ScheduleCard items={scheduleItems} />
          <AlertCenterCard items={alertItems} />
        </section>
      </div>
    </div>
  );
}
