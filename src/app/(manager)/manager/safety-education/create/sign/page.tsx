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
import { useCreateSafetyEducationLog } from "@/hooks/use-create-safety-education-log";
import { handleSafetyEducationLogManagerSignature } from "@/lib/api/safety-education-log-signature";
import { getSafetyEducationLogPdfUrl } from "@/lib/api/get-safety-education-log-pdf";
import { useSafetyEducationLogAttendees } from "@/hooks/use-safety-education-log-attendees";
import { useSafetyEducationLogs } from "@/hooks/use-safety-education-logs";

export default function ManagerSafetyEducationSignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const signaturePadRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  // 서명 완료 시점의 로컬 상태 (즉시 반영용)
  const [isManagerSigned, setIsManagerSigned] = useState(false);

  // 쿼리 파라미터에서 logId 가져오기 (기존 로그를 불러올 때)
  const logIdFromQuery = useMemo(() => {
    const logIdParam = searchParams.get("logId");
    return logIdParam ? Number.parseInt(logIdParam, 10) : null;
  }, [searchParams]);

  // logId가 있을 때 안전교육일지 목록에서 정보 가져오기
  const { data: logsData } = useSafetyEducationLogs(
    {
      siteId: parsedSiteId,
    },
    {
      enabled: hasValidSiteId && logIdFromQuery != null,
    },
  );

  // 목록에서 해당 logId의 항목 찾기
  const logItem = useMemo(() => {
    if (!logsData?.items || !logIdFromQuery) return null;
    return logsData.items.find((item) => item.id === logIdFromQuery);
  }, [logsData, logIdFromQuery]);

  // logItem의 status가 업데이트되면 로컬 상태 초기화 (refetch 완료 후)
  useEffect(() => {
    if (logItem?.status === "MANAGER_SIGNED" || logItem?.status === "COMPLETED") {
      setIsManagerSigned(false); // API에서 받은 상태로 동기화
    }
  }, [logItem?.status]);

  // 세션 스토리지에서 교육 정보 및 선택된 근로자 가져오기 (긴 텍스트를 URL에 포함하지 않기 위해)
  const educationData = useMemo(() => {
    // logId가 있고 목록에서 정보를 찾았으면 그것을 우선 사용
    if (logItem) {
      return {
        siteName: siteDetail?.siteName ?? "",
        siteAddress: siteDetail?.siteAddress ?? "",
        educationType: logItem.educationType,
        educationSubject: logItem.educationSubject,
        educationContent: "", // 목록 API에는 없음
        instructorName: logItem.instructorName,
        educationLocation: "", // 목록 API에는 없음
        selectedEmployeeIds: [], // 참석자 정보는 attendees API에서 가져옴
      };
    }

    // 세션 스토리지에서 가져오기
    const storedData = sessionStorage.getItem("safety-education-form-data");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return {
          siteName: parsed.siteName ?? "",
          siteAddress: parsed.siteAddress ?? "",
          educationType: parsed.educationType ?? "",
          educationSubject: parsed.educationSubject ?? "",
          educationContent: parsed.educationContent ?? "",
          instructorName: parsed.instructorName ?? "",
          educationLocation: parsed.educationLocation ?? "",
          selectedEmployeeIds: parsed.selectedEmployeeIds ?? [],
        };
      } catch (e) {
        console.error("Failed to parse education data from sessionStorage", e);
      }
    }

    // 폴백: 쿼리 파라미터에서 가져오기 (하위 호환성)
    const selectedEmployeeIdsJson = searchParams.get("selectedEmployeeIds");
    let selectedEmployeeIds: number[] = [];
    if (selectedEmployeeIdsJson) {
      try {
        selectedEmployeeIds = JSON.parse(selectedEmployeeIdsJson);
      } catch (e) {
        console.error("Failed to parse selectedEmployeeIds", e);
      }
    }

    return {
      siteName: searchParams.get("siteName") ?? "",
      siteAddress: searchParams.get("siteAddress") ?? "",
      educationType: searchParams.get("educationType") ?? "",
      educationSubject: searchParams.get("educationSubject") ?? "",
      educationContent: searchParams.get("educationContent") ?? "",
      instructorName: searchParams.get("instructorName") ?? "",
      educationLocation: searchParams.get("educationLocation") ?? "",
      selectedEmployeeIds,
    };
  }, [searchParams, logItem, siteDetail]);

  const signerName = user?.name ?? "";
  const signDate = dayjs().format("YYYY-MM-DD");

  const [logId, setLogId] = useState<number | null>(logIdFromQuery);
  const [initialPdfUrl, setInitialPdfUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const hasCreatedRef = useRef(false);

  // logIdFromQuery가 변경되면 logId 업데이트
  useEffect(() => {
    if (logIdFromQuery != null && !Number.isNaN(logIdFromQuery)) {
      setLogId(logIdFromQuery);
    }
  }, [logIdFromQuery]);

  const createLogMutation = useCreateSafetyEducationLog(parsedSiteId, {
    onSuccess: (data) => {
      setLogId(data.safetyEducationLogId);
      setInitialPdfUrl(data.pdfUrl);
      setIsCreating(false);
      notification.success({
        message: "안전교육일지가 생성되었습니다.",
        placement: "topRight",
      });
    },
    onError: (error) => {
      setIsCreating(false);
      notification.error({
        message: error.message || "안전교육일지를 생성하는 중 오류가 발생했습니다.",
        placement: "topRight",
      });
    },
  });

  // 페이지 로드 시 안전교육일지 생성 (logId가 없을 때만, 한 번만 실행)
  useEffect(() => {
    if (
      !hasCreatedRef.current &&
      !isCreating &&
      !logId &&
      hasValidSiteId &&
      educationData.selectedEmployeeIds.length > 0 &&
      !createLogMutation.isPending
    ) {
      hasCreatedRef.current = true;
      setIsCreating(true);
      createLogMutation.mutate({
        educationType: educationData.educationType as
          | "REGULAR"
          | "HIRING"
          | "WORK_CHANGE"
          | "SPECIAL"
          | "OTHER",
        educationSubject: educationData.educationSubject,
        educationContent: educationData.educationContent,
        instructorName: educationData.instructorName,
        educationLocation: educationData.educationLocation,
        attendeeEmployeeIds: educationData.selectedEmployeeIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidSiteId, educationData.selectedEmployeeIds.length, logId]);

  // 초기 PDF URL이 있으면 사용, 없으면 API에서 가져오기
  const {
    data: fetchedPdfUrl,
    isLoading: isPdfLoading,
    refetch: refetchPdf,
  } = useQuery({
    queryKey: ["safety-education-log-pdf", parsedSiteId, logId],
    queryFn: () => {
      if (logId == null) {
        return Promise.reject(new Error("안전교육일지 ID가 없습니다."));
      }
      return getSafetyEducationLogPdfUrl(parsedSiteId, logId);
    },
    enabled: logId != null && hasValidSiteId,
    staleTime: 1000 * 60 * 5,
  });

  const pdfUrl = initialPdfUrl || fetchedPdfUrl;

  // 참석자 서명 현황 조회
  const { data: attendeesData } = useSafetyEducationLogAttendees(parsedSiteId, logId, {
    enabled: logId != null && hasValidSiteId,
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

    if (!logId) {
      notification.error({
        message: "안전교육일지가 생성되지 않았습니다. 잠시 후 다시 시도해주세요.",
        placement: "topRight",
      });
      return;
    }

    try {
      const dataUrl = pad.toDataURL("image/png");
      await handleSafetyEducationLogManagerSignature(parsedSiteId, logId, dataUrl);

      // 서명 완료 로컬 상태 업데이트 (즉시 UI 반영)
      setIsManagerSigned(true);

      // 서명 후 PDF URL을 다시 조회 (서명된 PDF를 가져오기 위해)
      // initialPdfUrl을 null로 설정하여 API에서 다시 가져오도록 함
      setInitialPdfUrl(null);
      // 쿼리 재조회
      await refetchPdf();

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
    if (!logId) {
      notification.warning({
        message: "안전교육일지가 생성되지 않았습니다.",
        placement: "topRight",
      });
      return;
    }

    // 모든 근로자가 서명 완료되었는지 확인
    if (attendeesData) {
      const allSigned = attendeesData.attendees.every((attendee) => attendee.isSigned);
      if (!allSigned) {
        notification.warning({
          message: "모든 교육 대상자의 서명이 완료되어야 합니다.",
          placement: "topRight",
        });
        return;
      }
    }

    // 모든 서명이 완료되었으면 목록 페이지로 이동
    // 세션 스토리지 정리
    sessionStorage.removeItem("safety-education-form-data");
    router.push("/manager/safety-education?created=true");
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

      {/* 문서 미리보기 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="mb-0 text-lg font-normal text-brand-primary-strong">문서 미리보기</h3>
          <div className="flex gap-2">
            <Button variant="primary" size="md" onClick={handleDownloadPdf}>
              새 창 열기
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

      {/* 담당자 서명 - 관리자 서명이 완료되지 않은 경우에만 표시 */}
      {!isManagerSigned &&
        logItem?.status !== "MANAGER_SIGNED" &&
        logItem?.status !== "COMPLETED" && (
          <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
            <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">담당자 서명</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-brand-primary-strong">
                    서명자 이름
                  </label>
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
        )}

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
              {!attendeesData ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-[#e1e5ea] px-4 py-8 text-center text-text-subtle"
                  >
                    참석자 정보를 불러오는 중...
                  </td>
                </tr>
              ) : attendeesData.attendees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-[#e1e5ea] px-4 py-8 text-center text-text-subtle"
                  >
                    선택된 교육 대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                attendeesData.attendees.map((attendee) => {
                  return (
                    <tr key={attendee.employeeId}>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {attendee.empType === "PERMANENT" ? "상용" : "일용"}
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {attendee.empName}
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center text-sm text-text-strong">
                        {/* 주민등록번호는 API에서 제공되지 않음 */}-
                      </td>
                      <td className="border border-[#e1e5ea] px-4 py-4 text-center">
                        {attendee.isSigned ? (
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
