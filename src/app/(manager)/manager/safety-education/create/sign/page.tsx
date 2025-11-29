"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, notification } from "antd";
import SignatureCanvas from "react-signature-canvas";
import dayjs from "dayjs";

import { PDFViewer } from "@/components/common/pdf-viewer";
import { Button } from "@/components/ui/Button/button";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import { useQuery } from "@tanstack/react-query";
import { useCreateSafetyEducationReport } from "@/hooks/use-create-safety-education-report";
import { handleSafetyEducationManagerSignature } from "@/lib/api/safety-education-signature";
import { getSafetyEducationReportPdfUrl } from "@/lib/api/get-safety-education-report-pdf";

type SelectedEmployee = {
  employeeId: number;
  name: string;
  employmentType: "REGULAR" | "DAILY";
};

export default function ManagerSafetyEducationSignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const signaturePadRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Query params에서 교육 정보 및 선택된 근로자 가져오기
  const educationData = useMemo(() => {
    const selectedEmployeesJson = searchParams.get("selectedEmployees");
    let selectedEmployees: SelectedEmployee[] = [];
    if (selectedEmployeesJson) {
      try {
        selectedEmployees = JSON.parse(selectedEmployeesJson);
      } catch (e) {
        console.error("Failed to parse selectedEmployees", e);
      }
    }

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
      selectedEmployees,
    };
  }, [searchParams]);

  const signerName = user?.name ?? "";
  const signDate = dayjs().format("YYYY-MM-DD");

  const [reportId, setReportId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const hasCreatedRef = useRef(false);

  const createReportMutation = useCreateSafetyEducationReport(parsedSiteId, {
    onSuccess: (data) => {
      setReportId(data.safetyEducationReportId);
      setIsCreating(false);
      notification.success({
        message: "안전교육 일지가 생성되었습니다.",
        placement: "topRight",
      });
    },
    onError: (error) => {
      setIsCreating(false);
      notification.error({
        message: error.message || "안전교육 일지를 생성하는 중 오류가 발생했습니다.",
        placement: "topRight",
      });
    },
  });

  // 페이지 로드 시 안전교육 일지 생성 (한 번만 실행)
  useEffect(() => {
    if (
      !hasCreatedRef.current &&
      !isCreating &&
      !reportId &&
      hasValidSiteId &&
      educationData.selectedEmployees.length > 0 &&
      !createReportMutation.isPending
    ) {
      hasCreatedRef.current = true;
      setIsCreating(true);
      createReportMutation.mutate({
        educationDate: educationData.educationDate,
        educationType: educationData.educationType as
          | "REGULAR"
          | "HIRING"
          | "WORK_CHANGE"
          | "SPECIAL"
          | "OTHER",
        otherEducationType:
          educationData.educationType === "OTHER" ? educationData.otherEducationType : undefined,
        educationSubject: educationData.educationSubject,
        educationContent: educationData.educationContent,
        instructorName: educationData.instructorName,
        educationLocation: educationData.educationLocation,
        participants: educationData.selectedEmployees,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidSiteId, educationData.selectedEmployees.length]);

  const { data: pdfUrl, isLoading: isPdfLoading } = useQuery({
    queryKey: ["safety-education-report-pdf", parsedSiteId, reportId],
    queryFn: () => {
      if (reportId == null) {
        return Promise.reject(new Error("안전교육 일지 ID가 없습니다."));
      }
      return getSafetyEducationReportPdfUrl(parsedSiteId, reportId);
    },
    enabled: reportId != null && hasValidSiteId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const resize = () => {
      if (!signaturePadRef.current) return;
      const canvas = signaturePadRef.current.getCanvas();
      if (!canvas) return;

      const ratio = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const timeoutId = setTimeout(resize, 100);
    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSignatureClear = () => {
    signaturePadRef.current?.clear();
    setHasSignature(false);
  };

  const handleSignatureSave = async () => {
    const pad = signaturePadRef.current;
    if (!pad || pad.isEmpty()) {
      notification.warning({
        message: "서명을 입력해주세요.",
        placement: "topRight",
      });
      return;
    }

    if (!reportId) {
      notification.error({
        message: "안전교육 일지가 생성되지 않았습니다. 잠시 후 다시 시도해주세요.",
        placement: "topRight",
      });
      return;
    }

    try {
      const dataUrl = pad.toDataURL("image/png");
      await handleSafetyEducationManagerSignature(parsedSiteId, reportId, dataUrl);

      notification.success({
        message: "담당자 서명이 저장되었습니다.",
        placement: "topRight",
      });

      setHasSignature(false);
      pad.clear();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "담당자 서명을 처리하는 중 오류가 발생했습니다.";
      notification.error({
        message,
        placement: "topRight",
      });
    }
  };

  const handleConfirm = () => {
    if (!reportId) {
      notification.warning({
        message: "안전교육 일지가 생성되지 않았습니다.",
        placement: "topRight",
      });
      return;
    }
    router.push("/manager/safety-education?created=true");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
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
          안전교육일지 서명
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          아래는 자동 생성된 안전교육 일지입니다. 담당자 서명 후 문서를 저장하세요.
        </p>
      </header>

      {/* 교육 기본 정보 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육 일자</label>
            <Input
              value={dayjs(educationData.educationDate).format("YYYY-MM-DD")}
              disabled
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">작성자</label>
            <Input value={educationData.author} disabled className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* 문서 미리보기 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="mb-0 text-lg font-normal text-brand-primary-strong">문서 미리보기</h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={handlePrint}>
              인쇄
            </Button>
            <Button variant="primary" size="md" onClick={handleDownloadPdf}>
              PDF 다운로드
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-[#f9fafb] p-4 dark:border-dark-border dark:bg-dark-bg-surface">
          {isCreating ? (
            <div className="flex h-[480px] items-center justify-center text-text-subtle">
              안전교육 일지를 생성하는 중...
            </div>
          ) : isPdfLoading ? (
            <div className="flex h-[480px] items-center justify-center text-text-subtle">
              PDF를 불러오는 중...
            </div>
          ) : pdfUrl ? (
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <div className="flex h-[480px] flex-col items-center justify-center text-text-subtle">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 opacity-50"
              >
                <path
                  d="M15 5H35L45 15V50C45 52.7614 42.7614 55 40 55H15C12.2386 55 10 52.7614 10 50V10C10 7.23858 12.2386 5 15 5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M35 5V15H45"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mb-2 text-base">PDF 문서 미리보기</p>
              <p className="text-sm">A4 형태의 안전교육일지가 표시됩니다</p>
            </div>
          )}
        </div>
      </section>

      {/* 담당자 서명 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">담당자 서명</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-brand-primary-strong">서명자 이름</label>
              <Input value={signerName} disabled className="rounded-lg" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-brand-primary-strong">서명일자</label>
              <Input value={signDate} disabled className="rounded-lg" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">서명 입력란</label>
            <div className="relative rounded-xl border border-[#d1d5db] bg-[#f9fafb] p-4">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: "w-full h-48 border-0 bg-transparent",
                }}
                onEnd={() => setHasSignature(true)}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {!hasSignature && (
                  <div className="text-center text-text-subtle">
                    <Image
                      src="/assets/icons/signature.svg"
                      alt="서명"
                      width={30}
                      height={30}
                      className="mx-auto mb-2 opacity-30"
                    />
                    <p className="text-sm italic">여기에 서명하세요</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="md" onClick={handleSignatureClear}>
                서명 지우기
              </Button>
              <Button variant="primary" size="md" onClick={handleSignatureSave}>
                서명 저장하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 교육 대상자 서명 현황 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">
          교육 대상자 서명 현황
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  구분
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  교육 대상자
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  주민등록번호
                </th>
                <th className="border border-[#e1e5ea] px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {educationData.selectedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-[#e1e5ea] px-4 py-8 text-center text-text-subtle"
                  >
                    선택된 교육 대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                educationData.selectedEmployees.map((employee, index) => {
                  // TODO: 실제 서명 상태는 API에서 받아와야 함
                  const isSigned = index % 2 === 0; // 임시로 일부만 서명 완료로 표시

                  return (
                    <tr key={employee.employeeId}>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {employee.employmentType === "REGULAR" ? "상용" : "일용"}
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {employee.name}
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {/* TODO: 주민등록번호 정보 필요 */}-
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center">
                        {isSigned ? (
                          <StatusPill variant="success" size="sm">
                            서명 완료
                          </StatusPill>
                        ) : (
                          <StatusPill variant="danger" size="sm">
                            서명 대기
                          </StatusPill>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 하단 액션 버튼 */}
      <section className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleConfirm}>
          확인
        </Button>
      </section>
    </div>
  );
}
