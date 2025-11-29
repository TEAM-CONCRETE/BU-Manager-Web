"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Input, Select, notification } from "antd";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/button";
import { useContractInfo } from "@/hooks/use-contract-info";
import { useCreateWorkReport } from "@/hooks/use-create-work-report";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";

type WorkforceEntry = {
  id: string;
  process: string;
  todayCount: number;
};

type MaterialEntry = {
  id: string;
  name: string;
  specification: string;
  unit: string;
  todayQuantity: number;
};

type WorkDetailEntry = {
  id: string;
  process: string;
  description: string;
};

export default function ManagerWorkReportCreatePage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);
  const { data: contractInfo } = useContractInfo(parsedSiteId, { enabled: hasValidSiteId });

  const createWorkReportMutation = useCreateWorkReport(parsedSiteId, {
    onSuccess: () => {
      notification.success({
        message: "작업일보가 저장되었습니다.",
        placement: "topRight",
        duration: 3,
      });
      router.push("/manager/work-reports?created=true");
    },
    onError: (error) => {
      notification.error({
        message: error.message || "작업일보 저장 중 오류가 발생했습니다.",
        placement: "topRight",
        duration: 3,
      });
    },
  });

  const today = dayjs().format("YYYY-MM-DD");
  const authorName = user?.name ? `${user.name} (${user.role ?? ""})` : "";

  const basicInfo = useMemo(
    () => ({
      siteName: contractInfo?.siteName ?? siteDetail?.siteName ?? "",
      siteAddress: contractInfo?.siteAddress ?? siteDetail?.siteAddress ?? "",
      workDate: today,
      constructionStartDate: siteDetail?.startDate ?? "",
      constructionEndDate: siteDetail?.endDate ?? "",
      author: authorName,
    }),
    [contractInfo, siteDetail, today, authorName],
  );

  const [workforceEntries, setWorkforceEntries] = useState<WorkforceEntry[]>([
    { id: "1", process: "", todayCount: 0 },
  ]);

  // 작업내역은 인력 투입 현황의 공정을 기반으로 동적 생성
  const [workDetails, setWorkDetails] = useState<WorkDetailEntry[]>([]);

  const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([
    { id: "1", name: "", specification: "", unit: "", todayQuantity: 0 },
  ]);

  const processOptions = [
    { value: "미장공사", label: "미장공사" },
    { value: "전기공사", label: "전기공사" },
    { value: "설비공사", label: "설비공사" },
    { value: "도배공사", label: "도배공사" },
    { value: "타일공사", label: "타일공사" },
    { value: "조적공사", label: "조적공사" },
    { value: "철근공사", label: "철근공사" },
    { value: "콘크리트공사", label: "콘크리트공사" },
    { value: "기타", label: "기타" },
  ];

  const handleAddWorkforceRow = () => {
    const newId = String(Date.now());
    setWorkforceEntries([...workforceEntries, { id: newId, process: "", todayCount: 0 }]);
  };

  const handleRemoveWorkforceRow = (id: string) => {
    setWorkforceEntries(workforceEntries.filter((entry) => entry.id !== id));
  };

  const handleWorkforceChange = (
    id: string,
    field: keyof WorkforceEntry,
    value: string | number,
  ) => {
    const updatedEntries = workforceEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    );
    setWorkforceEntries(updatedEntries);

    if (field === "process") {
      const updatedEntry = updatedEntries.find((e) => e.id === id);
      if (updatedEntry?.process) {
        const existingDetail = workDetails.find((d) => d.process === updatedEntry.process);
        if (!existingDetail) {
          setWorkDetails([
            ...workDetails,
            { id: String(Date.now()), process: updatedEntry.process, description: "" },
          ]);
        }
      }
    }
  };

  const handleWorkDetailChange = (id: string, field: keyof WorkDetailEntry, value: string) => {
    setWorkDetails(
      workDetails.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );
  };

  const handleAddMaterialRow = () => {
    const newId = String(Date.now());
    setMaterialEntries([
      ...materialEntries,
      { id: newId, name: "", specification: "", unit: "", todayQuantity: 0 },
    ]);
  };

  const handleRemoveMaterialRow = (id: string) => {
    setMaterialEntries(materialEntries.filter((entry) => entry.id !== id));
  };

  const handleMaterialChange = (id: string, field: keyof MaterialEntry, value: string | number) => {
    setMaterialEntries(
      materialEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    // workSections 생성: workforceEntries와 workDetails를 매칭
    const workSections = workforceEntries
      .filter((entry) => entry.process && entry.todayCount > 0)
      .map((entry) => {
        const workDetail = workDetails.find((detail) => detail.process === entry.process);
        return {
          sectionName: entry.process,
          employeeNum: entry.todayCount,
          context: workDetail?.description || "",
        };
      });

    // materials 생성
    const materials = materialEntries
      .filter((entry) => entry.name && entry.specification && entry.unit)
      .map((entry) => ({
        materialName: entry.name,
        materialStandard: entry.specification,
        materialUnit: entry.unit,
      }));

    // 유효성 검사
    if (workSections.length === 0) {
      notification.warning({
        message: "인력 투입 현황을 입력해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    createWorkReportMutation.mutate({
      workSections,
      materials,
    });
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
          작업일보 작성
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          당일 작업 내용을 기록합니다.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">기본 정보</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">현장명</label>
            <Input value={basicInfo.siteName} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">현장주소</label>
            <Input value={basicInfo.siteAddress} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">작성일</label>
            <Input value={basicInfo.workDate} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">공사 시작일</label>
            <Input value={basicInfo.constructionStartDate} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">공사 종료일</label>
            <Input value={basicInfo.constructionEndDate} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">작성자</label>
            <Input value={basicInfo.author} disabled className="rounded-lg" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">인력 투입 현황</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb]">
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  No
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  공정
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  금일
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {workforceEntries.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                    {index + 1}
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4">
                    <Select
                      value={entry.process || undefined}
                      onChange={(value) => handleWorkforceChange(entry.id, "process", value)}
                      placeholder="공정 선택"
                      className="w-full"
                      options={processOptions}
                    />
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4">
                    <Input
                      type="number"
                      value={entry.todayCount || ""}
                      onChange={(e) =>
                        handleWorkforceChange(entry.id, "todayCount", Number(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="text-center"
                    />
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkforceRow(entry.id)}
                      className="text-text-subtle hover:text-text-strong"
                      aria-label="삭제"
                    >
                      <svg
                        width="11"
                        height="12"
                        viewBox="0 0 11 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3H10M8.5 3V10C8.5 10.5523 8.05228 11 7.5 11H3.5C2.94772 11 2.5 10.5523 2.5 10V3M4 3V2C4 1.44772 4.44772 1 5 1H6C6.55228 1 7 1.44772 7 2V3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddWorkforceRow}
            className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary-strong"
          >
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 1V13M1 7H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            행 추가
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">작업내역</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {workDetails.map((detail) => (
            <div key={detail.id}>
              <label className="mb-2 block text-sm text-brand-primary-strong">
                {detail.process || "공정"}
              </label>
              <Input.TextArea
                value={detail.description}
                onChange={(e) => handleWorkDetailChange(detail.id, "description", e.target.value)}
                placeholder={
                  detail.process
                    ? `예시) ${detail.process} 작업 내용을 입력하세요`
                    : "공정을 선택하세요"
                }
                rows={4}
                className="rounded-lg"
              />
            </div>
          ))}
          {workDetails.length === 0 && (
            <div className="col-span-2 text-center text-sm text-text-subtle">
              인력 투입 현황에서 공정을 선택하면 작업내역 입력란이 자동으로 생성됩니다.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">자재 투입 현황</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb]">
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  No
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  품명
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  규격
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  단위
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  금일
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {materialEntries.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                    {index + 1}
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4">
                    <Input
                      value={entry.name}
                      onChange={(e) => handleMaterialChange(entry.id, "name", e.target.value)}
                      placeholder="ex. 집수정"
                      className="rounded"
                    />
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4">
                    <Input
                      value={entry.specification}
                      onChange={(e) =>
                        handleMaterialChange(entry.id, "specification", e.target.value)
                      }
                      placeholder="ex. 600x400x900"
                      className="rounded"
                    />
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4">
                    <Input
                      value={entry.unit}
                      onChange={(e) => handleMaterialChange(entry.id, "unit", e.target.value)}
                      placeholder="ex. m"
                      className="rounded text-center"
                    />
                  </td>
                  <td className="border border-[#e1e5ea] bg-[#f8f9fb] px-4 py-4 text-center text-sm text-text-subtle">
                    자동
                  </td>
                  <td className="border border-[#e1e5ea] px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterialRow(entry.id)}
                      className="text-text-subtle hover:text-text-strong"
                      aria-label="삭제"
                    >
                      <svg
                        width="11"
                        height="12"
                        viewBox="0 0 11 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3H10M8.5 3V10C8.5 10.5523 8.05228 11 7.5 11H3.5C2.94772 11 2.5 10.5523 2.5 10V3M4 3V2C4 1.44772 4.44772 1 5 1H6C6.55228 1 7 1.44772 7 2V3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddMaterialRow}
            className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary-strong"
          >
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 1V13M1 7H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            자재 추가
          </button>
        </div>
      </section>

      {/* 하단 액션 버튼 */}
      <section className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={createWorkReportMutation.isPending}
        >
          {createWorkReportMutation.isPending ? "저장 중..." : "작업일보 저장"}
        </Button>
      </section>
    </div>
  );
}
