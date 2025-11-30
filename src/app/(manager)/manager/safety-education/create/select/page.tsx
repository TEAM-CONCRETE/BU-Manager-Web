"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notification } from "antd";
import { Button } from "@/components/ui/Button/button";
import { Table } from "@/components/ui/Table/table";
import {
  EmploymentTypeFilterChips,
  type EmploymentFilterValue,
} from "@/components/features/manager/employment-type-filter-chips";
import { useSafetyEducationLogEmployees } from "@/hooks/use-safety-education-log-employees";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import type { SafetyEducationLogEmployee } from "@/lib/api/get-safety-education-log-employees";

export default function ManagerSafetyEducationSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  // 세션 스토리지에서 교육 정보 가져오기 (긴 텍스트를 URL에 포함하지 않기 위해)
  const educationData = useMemo(() => {
    const storedData = sessionStorage.getItem("safety-education-form-data");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error("Failed to parse education data from sessionStorage", e);
      }
    }
    // 폴백: 쿼리 파라미터에서 가져오기 (하위 호환성)
    return {
      siteName: searchParams.get("siteName") ?? "",
      siteAddress: searchParams.get("siteAddress") ?? "",
      educationDate: searchParams.get("educationDate") ?? "",
      author: searchParams.get("author") ?? "",
      educationType: searchParams.get("educationType") ?? "",
      otherEducationType: searchParams.get("otherEducationType") ?? "",
      educationSubject: searchParams.get("educationSubject") ?? "",
      educationContent: searchParams.get("educationContent") ?? "",
      instructorName: searchParams.get("instructorName") ?? "",
      educationLocation: searchParams.get("educationLocation") ?? "",
    };
  }, [searchParams]);

  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilterValue>("ALL");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<number>>(new Set());

  // 근로자 목록 조회
  const empType: "ALL" | "PERMANENT" | "DAILY" =
    employmentFilter === "ALL" ? "ALL" : employmentFilter === "REGULAR" ? "PERMANENT" : "DAILY";

  const { data: employeesData, isLoading: isLoadingEmployees } = useSafetyEducationLogEmployees(
    {
      siteId: parsedSiteId,
      empType,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const employees = useMemo(() => employeesData?.items ?? [], [employeesData?.items]);

  // 선택된 근로자 통계
  const selectedEmployees = useMemo(() => {
    return employees.filter((emp) => selectedEmployeeIds.has(emp.employeeId));
  }, [employees, selectedEmployeeIds]);

  const selectedCount = selectedEmployees.length;
  const selectedRegularCount = selectedEmployees.filter(
    (emp) => emp.empType === "PERMANENT",
  ).length;
  const selectedDailyCount = selectedEmployees.filter((emp) => emp.empType === "DAILY").length;

  const handleResetSelection = () => {
    setSelectedEmployeeIds(new Set());
  };

  const handleBack = () => {
    // 세션 스토리지는 유지 (뒤로 가기 시 데이터 보존)
    router.back();
  };

  const handleNext = () => {
    if (selectedEmployeeIds.size === 0) {
      notification.warning({
        message: "교육 대상자를 최소 1명 이상 선택해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    // 선택된 근로자 ID 배열을 세션 스토리지에 추가
    const selectedEmployeeIdsArray = Array.from(selectedEmployeeIds);
    const updatedEducationData = {
      ...educationData,
      selectedEmployeeIds: selectedEmployeeIdsArray,
    };
    sessionStorage.setItem("safety-education-form-data", JSON.stringify(updatedEducationData));

    // 다음 단계로 이동 (짧은 정보만 query params로 전달)
    const params = new URLSearchParams({
      educationType: educationData.educationType,
      educationSubject: educationData.educationSubject,
    });

    router.push(`/manager/safety-education/create/sign?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-border bg-bg-surface p-3 dark:border-dark-border dark:bg-dark-bg-surface">
        <header className="space-y-1">
          <h1 className="mb-0! text-2xl font-semibold! text-text-strong dark:text-dark-text-strong">
            {siteDetail?.siteName ?? "현장 이름을 불러오는 중..."}
          </h1>
          <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
            {siteDetail?.siteAddress ?? "현장 주소를 불러오는 중입니다."}
          </p>
        </header>
      </section>

      <header className="ml-3 space-y-1">
        <h2 className="mb-0! text-2xl font-semibold! text-brand-primary-strong dark:text-dark-text-strong">
          안전교육 대상자 선택
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          안전교육을 받은 근로자를 아래 표에서 선택하세요.
        </p>
      </header>

      {/* 필터 영역 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <EmploymentTypeFilterChips
              value={employmentFilter}
              onChange={(value) => {
                setEmploymentFilter(value);
              }}
            />
          </div>
        </div>
      </section>

      {/* 근로자 선택 테이블 */}
      <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
        <Table<SafetyEducationLogEmployee>
          dataSource={employees}
          loading={isLoadingEmployees}
          rowKey={(record) => record.employeeId}
          pagination={false}
          rowSelection={{
            selectedRowKeys: Array.from(selectedEmployeeIds),
            onSelectAll: (selected) => {
              if (selected) {
                setSelectedEmployeeIds(new Set(employees.map((emp) => emp.employeeId)));
              } else {
                setSelectedEmployeeIds(new Set());
              }
            },
            onSelect: (record, selected) => {
              const newSet = new Set(selectedEmployeeIds);
              if (selected) {
                newSet.add(record.employeeId);
              } else {
                newSet.delete(record.employeeId);
              }
              setSelectedEmployeeIds(newSet);
            },
          }}
          columns={[
            {
              title: "구분",
              dataIndex: "empType",
              key: "empType",
              align: "center",
              render: (type: "PERMANENT" | "DAILY") => (type === "PERMANENT" ? "상용" : "일용"),
            },
            {
              title: "사원",
              dataIndex: "empName",
              key: "empName",
              align: "center",
            },
            {
              title: (
                <>
                  안전교육이수
                  <br />
                  여부
                </>
              ),
              dataIndex: "hasSafetyEducation",
              key: "hasSafetyEducation",
              align: "center",
              render: (hasCompleted: boolean) =>
                hasCompleted ? (
                  <span className="text-state-success">○</span>
                ) : (
                  <span className="text-state-danger">×</span>
                ),
            },
            {
              title: "주민등록번호",
              dataIndex: "residentNum",
              key: "residentNum",
              align: "center",
              render: (value: string) => value || "-",
            },
          ]}
          showHeaderBar={false}
          borderedContainer={false}
          className="rounded-2xl border border-border bg-white dark:border-dark-border dark:bg-dark-bg-surface"
        />
      </section>

      {/* 선택된 근로자 통계 */}
      <section className="rounded-2xl border border-border bg-[#f8f9fb] px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">선택된 근로자 수</p>
            <p className="text-lg font-medium text-brand-primary">{selectedCount}명</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">상용 근로자</p>
            <p className="text-lg font-medium text-brand-primary">{selectedRegularCount}명</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">일용 근로자</p>
            <p className="text-lg font-medium text-brand-primary">{selectedDailyCount}명</p>
          </div>
        </div>
      </section>

      {/* 하단 액션 버튼 */}
      <section className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={handleBack}>
          이전 단계
        </Button>
        <Button variant="secondary" size="md" onClick={handleResetSelection}>
          선택 초기화
        </Button>
        <Button variant="primary" size="md" onClick={handleNext}>
          다음 단계로
        </Button>
      </section>
    </div>
  );
}
