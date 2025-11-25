"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCompanySites } from "@/hooks/use-company-sites";

type Props = {
  fallbackHref?: string;
  targetSection?: string;
};

export function CompanySiteRedirector({
  fallbackHref = "/company",
  targetSection = "dashboard",
}: Props) {
  const router = useRouter();
  const { data, isLoading } = useCompanySites();
  const sites = useMemo(() => data?.sites ?? [], [data]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!sites.length) {
      return;
    }

    router.replace(`/company/${sites[0].siteId}/${targetSection}`);
  }, [isLoading, sites, router, targetSection]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-text-subtle dark:text-dark-text-base">
        현장 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (!sites.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center text-text-subtle dark:text-dark-text-base">
        <p>등록된 현장이 없습니다.</p>
        <button
          type="button"
          className="rounded-xl border border-border px-4 py-2 text-sm text-text-base dark:border-dark-border dark:text-dark-text-base"
          onClick={() => router.replace(fallbackHref)}
        >
          뒤로가기
        </button>
      </div>
    );
  }

  return null;
}
