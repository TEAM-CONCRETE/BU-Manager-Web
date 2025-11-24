"use client";

import { useMemo, useState } from "react";

import { SidebarLayout } from "@/components/common/SidebarNavigation/sidebar-layout";
import type { SidebarMenuItem } from "@/components/common/SidebarNavigation/sidebar-navigation";
import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import { OverviewCard } from "@/components/features/company/dashboard/overview-card";
import { WorkforceCard } from "@/components/features/company/dashboard/workforce-card";
import { LaborKpiCard } from "@/components/features/company/dashboard/labor-kpi-card";
import { SafetyKpiCard } from "@/components/features/company/dashboard/safety-kpi-card";
import { ScheduleCard } from "@/components/features/company/dashboard/schedule-card";
import { AlertCenterCard } from "@/components/features/company/dashboard/alert-center-card";
import type { StatusPillProps } from "@/components/ui/StatusPill/status-pill";

import { companyTopNavItems } from "@/constants/company-nav";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  variant: StatusPillProps["variant"];
};

const buildingIcon = (
  <svg
    width="20"
    height="24"
    viewBox="0 0 16 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d="M2.9375 3C2.00586 3 1.25 3.75586 1.25 4.6875V19.3125C1.25 20.2441 2.00586 21 2.9375 21H6.3125V18.1875C6.3125 17.2559 7.06836 16.5 8 16.5C8.93164 16.5 9.6875 17.2559 9.6875 18.1875V21H13.0625C13.9941 21 14.75 20.2441 14.75 19.3125V4.6875C14.75 3.75586 13.9941 3 13.0625 3H2.9375ZM3.5 11.4375C3.5 11.1281 3.75312 10.875 4.0625 10.875H5.1875C5.49687 10.875 5.75 11.1281 5.75 11.4375V12.5625C5.75 12.8719 5.49687 13.125 5.1875 13.125H4.0625C3.75312 13.125 3.5 12.8719 3.5 12.5625V11.4375ZM7.4375 10.875H8.5625C8.87187 10.875 9.125 11.1281 9.125 11.4375V12.5625C9.125 12.8719 8.87187 13.125 8.5625 13.125H7.4375C7.12813 13.125 6.875 12.8719 6.875 12.5625V11.4375C6.875 11.1281 7.12813 10.875 7.4375 10.875ZM10.25 11.4375C10.25 11.1281 10.5031 10.875 10.8125 10.875H11.9375C12.2469 10.875 12.5 11.1281 12.5 11.4375V12.5625C12.5 12.8719 12.2469 13.125 11.9375 13.125H10.8125C10.5031 13.125 10.25 12.8719 10.25 12.5625V11.4375ZM4.0625 6.375H5.1875C5.49687 6.375 5.75 6.62812 5.75 6.9375V8.0625C5.75 8.37187 5.49687 8.625 5.1875 8.625H4.0625C3.75312 8.625 3.5 8.37187 3.5 8.0625V6.9375C3.5 6.62812 3.75312 6.375 4.0625 6.375ZM6.875 6.9375C6.875 6.62812 7.12813 6.375 7.4375 6.375H8.5625C8.87187 6.375 9.125 6.62812 9.125 6.9375V8.0625C9.125 8.37187 8.87187 8.625 8.5625 8.625H7.4375C7.12813 8.625 6.875 8.37187 6.875 8.0625V6.9375ZM10.8125 6.375H11.9375C12.2469 6.375 12.5 6.62812 12.5 6.9375V8.0625C12.5 8.37187 12.2469 8.625 11.9375 8.625H10.8125C10.5031 8.625 10.25 8.37187 10.25 8.0625V6.9375C10.25 6.62812 10.5031 6.375 10.8125 6.375Z" />
  </svg>
);

const siteMenu: SidebarMenuItem[] = [
  {
    id: "site-1",
    label: "이천 필그린 아파트",
    href: "/company/dashboard",
    active: true,
    icon: buildingIcon,
  },
  { id: "site-2", label: "용인 리가 아파트", href: "#site-2", icon: buildingIcon },
  { id: "site-3", label: "강남 아스하임 오피스텔", href: "#site-3", icon: buildingIcon },
  { id: "site-4", label: "위례 스마트 물류단지", href: "#site-4", icon: buildingIcon },
];

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

export default function CompanyDashboardPage() {
  const [selectedSiteId, setSelectedSiteId] = useState("site-1");
  const siteMenuItems = useMemo<SidebarMenuItem[]>(
    () =>
      siteMenu.map((item) => ({
        ...item,
        active: item.id === selectedSiteId,
        onClick: () => setSelectedSiteId(item.id),
      })),
    [selectedSiteId],
  );

  return (
    <SidebarLayout
      menuItems={siteMenuItems}
      bottomAction={{
        label: "현장 추가",
        onClick: () => {
          // TODO: 연결 예정
        },
      }}
      searchPlaceholder="현장명 또는 담당자를 검색하세요"
      logoHref="/company/dashboard"
    >
      <div className="min-h-full bg-bg-page px-4 py-6 dark:bg-dark-bg-page sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
          <CompanyTopNav items={companyTopNavItems} defaultActiveId="overview" />

          <header>
            <h1 className="!mb-1 text-3xl !font-bold text-text-strong dark:text-dark-text-strong">
              이천 A 아파트 현장
            </h1>
            <p className="!mb-0 text-base text-text-subtle dark:text-dark-text-base">
              현장 운영 현황을 한눈에 확인하세요
            </p>
          </header>

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
    </SidebarLayout>
  );
}
