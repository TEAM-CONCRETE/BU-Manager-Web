"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarLayout } from "@/components/common/SidebarNavigation/sidebar-layout";
import type { SidebarMenuItem } from "@/components/common/SidebarNavigation/sidebar-navigation";
import {
  SiteCreateModal,
  type SiteFormValues,
} from "@/components/features/company/site/site-create-modal";
import { SiteSecretKeyModal } from "@/components/features/company/site/site-secret-key-modal";
import { useCompanySites } from "@/hooks/use-company-sites";
import { useCreateSite } from "@/hooks/use-create-site";
import { useSessionStore } from "@/stores/session-store";
import { formatTodayAsYyyyMmDdDot } from "@/utils/date";

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="24"
    viewBox="0 0 16 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_657_26242)">
      <path
        d="M2.9375 3C2.00586 3 1.25 3.75586 1.25 4.6875V19.3125C1.25 20.2441 2.00586 21 2.9375 21H6.3125V18.1875C6.3125 17.2559 7.06836 16.5 8 16.5C8.93164 16.5 9.6875 17.2559 9.6875 18.1875V21H13.0625C13.9941 21 14.75 20.2441 14.75 19.3125V4.6875C14.75 3.75586 13.9941 3 13.0625 3H2.9375ZM3.5 11.4375C3.5 11.1281 3.75312 10.875 4.0625 10.875H5.1875C5.49687 10.875 5.75 11.1281 5.75 11.4375V12.5625C5.75 12.8719 5.49687 13.125 5.1875 13.125H4.0625C3.75312 13.125 3.5 12.8719 3.5 12.5625V11.4375ZM7.4375 10.875H8.5625C8.87187 10.875 9.125 11.1281 9.125 11.4375V12.5625C9.125 12.8719 8.87187 13.125 8.5625 13.125H7.4375C7.12813 13.125 6.875 12.8719 6.875 12.5625V11.4375C6.875 11.1281 7.12813 10.875 7.4375 10.875ZM10.25 11.4375C10.25 11.1281 10.5031 10.875 10.8125 10.875H11.9375C12.2469 10.875 12.5 11.1281 12.5 11.4375V12.5625C12.5 12.8719 12.2469 13.125 11.9375 13.125H10.8125C10.5031 13.125 10.25 12.8719 10.25 12.5625V11.4375ZM4.0625 6.375H5.1875C5.49687 6.375 5.75 6.62812 5.75 6.9375V8.0625C5.75 8.37187 5.49687 8.625 5.1875 8.625H4.0625C3.75312 8.625 3.5 8.37187 3.5 8.0625V6.9375C3.5 6.62812 3.75312 6.375 4.0625 6.375ZM6.875 6.9375C6.875 6.62812 7.12813 6.375 7.4375 6.375H8.5625C8.87187 6.375 9.125 6.62812 9.125 6.9375V8.0625C9.125 8.37187 8.87187 8.625 8.5625 8.625H7.4375C7.12813 8.625 6.875 8.37187 6.875 8.0625V6.9375C6.875 6.62812 7.12813 6.375 7.4375 6.375Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_657_26242">
        <path d="M1.25 3H14.75V21H1.25V3Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

type Props = {
  children: ReactNode;
  params: {
    siteId: string;
  };
};

type SiteSecretKeyInfo = {
  managerKey: string;
  workerKey: string;
  createdAt?: string;
  createdBy?: string;
};

export default function CompanySiteLayout({ children, params }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, refetch } = useCompanySites();
  const createSiteMutation = useCreateSite();
  const user = useSessionStore((state) => state.user);
  const sites = useMemo(() => data?.sites ?? [], [data]);
  const currentSiteId = params.siteId;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSecretKeyModalOpen, setIsSecretKeyModalOpen] = useState(false);
  const [secretKeyInfo, setSecretKeyInfo] = useState<SiteSecretKeyInfo | null>(null);

  const pathSegments = pathname?.split("/").filter(Boolean) ?? [];
  const currentSection = pathSegments[2] ?? "dashboard";

  useEffect(() => {
    if (isLoading || !sites.length) {
      return;
    }

    const exists = sites.some((site) => String(site.siteId) === currentSiteId);
    if (!exists) {
      router.replace(`/company/${sites[0].siteId}/dashboard`);
    }
  }, [sites, currentSiteId, router, isLoading]);

  const menuItems = useMemo<SidebarMenuItem[]>(() => {
    if (!sites.length) {
      return [
        {
          id: "empty",
          label: isLoading ? "현장 목록을 불러오는 중..." : "등록된 현장이 없습니다",
          active: true,
          icon: <BuildingIcon className="h-5 w-5 text-text-subtle" />,
        },
      ];
    }

    return sites.map((site) => {
      const id = String(site.siteId);
      return {
        id,
        label: site.siteName,
        icon: <BuildingIcon className="h-5 w-5" />,
        href: `/company/${id}/${currentSection}`,
        active: id === currentSiteId,
      };
    });
  }, [sites, currentSection, currentSiteId, isLoading]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitCreateSite = async (values: SiteFormValues) => {
    const created = await createSiteMutation.mutateAsync(values);

    setSecretKeyInfo({
      managerKey: created.managerSecretKey,
      workerKey: created.employeeSecretKey,
      createdAt: formatTodayAsYyyyMmDdDot(),
      createdBy: user?.name ? `${user.name}` : undefined,
    });

    setIsCreateModalOpen(false);
    setIsSecretKeyModalOpen(true);
    refetch();
  };

  const handleCloseSecretKeyModal = () => {
    setIsSecretKeyModalOpen(false);
  };

  const handleGoToMain = () => {
    setIsSecretKeyModalOpen(false);
    if (currentSiteId) {
      router.push(`/company/${currentSiteId}/dashboard`);
    }
  };

  const handleGoToSiteList = () => {
    setIsSecretKeyModalOpen(false);
  };

  return (
    <>
      <SidebarLayout
        menuItems={menuItems}
        bottomAction={{
          label: "현장 추가",
          onClick: handleOpenCreateModal,
        }}
        searchPlaceholder="현장명 또는 담당자를 검색하세요"
        logoHref={`/company/${currentSiteId ?? ""}/dashboard`}
      >
        {children}
      </SidebarLayout>

      <SiteCreateModal
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        onSubmit={handleSubmitCreateSite}
      />

      <SiteSecretKeyModal
        open={isSecretKeyModalOpen}
        onClose={handleCloseSecretKeyModal}
        managerKey={secretKeyInfo?.managerKey ?? ""}
        workerKey={secretKeyInfo?.workerKey ?? ""}
        createdAt={secretKeyInfo?.createdAt}
        createdBy={secretKeyInfo?.createdBy}
        onGoToMain={handleGoToMain}
        onGoToSiteList={handleGoToSiteList}
      />
    </>
  );
}
