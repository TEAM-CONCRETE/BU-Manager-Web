"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Input, Radio, notification } from "antd";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/button";
import { useContractInfo } from "@/hooks/use-contract-info";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";

type EducationType = "REGULAR" | "HIRING" | "WORK_CHANGE" | "SPECIAL" | "OTHER";

export default function ManagerSafetyEducationCreatePage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);
  const { data: contractInfo } = useContractInfo(parsedSiteId, { enabled: hasValidSiteId });

  const today = dayjs().format("YYYY년 MM월 DD일");
  const authorName = user?.name ? `${user.name} (${user.role ?? ""})` : "";

  const basicInfo = useMemo(
    () => ({
      siteName: contractInfo?.siteName ?? siteDetail?.siteName ?? "",
      siteAddress: contractInfo?.siteAddress ?? siteDetail?.siteAddress ?? "",
      educationDate: today,
      author: authorName,
    }),
    [contractInfo, siteDetail, today, authorName],
  );

  const [educationType, setEducationType] = useState<EducationType | undefined>(undefined);
  const [educationSubject, setEducationSubject] = useState("");
  const [educationContent, setEducationContent] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [educationLocation, setEducationLocation] = useState("");

  const handleCancel = () => {
    // 세션 스토리지 정리
    sessionStorage.removeItem("safety-education-form-data");
    router.back();
  };

  const handleNext = () => {
    // 유효성 검사
    if (!educationType) {
      notification.warning({
        message: "교육 구분을 선택해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    if (!educationSubject.trim()) {
      notification.warning({
        message: "교육과목을 입력해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    if (!educationContent.trim()) {
      notification.warning({
        message: "교육내용을 입력해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    // 교육 정보를 세션 스토리지에 저장 (긴 텍스트를 URL에 포함하지 않기 위해)
    const educationData = {
      siteName: basicInfo.siteName,
      siteAddress: basicInfo.siteAddress,
      educationType,
      educationSubject,
      educationContent,
      instructorName,
      educationLocation,
    };
    sessionStorage.setItem("safety-education-form-data", JSON.stringify(educationData));

    // 다음 단계로 이동 (짧은 정보만 query params로 전달)
    const params = new URLSearchParams({
      educationType,
      educationSubject,
    });

    router.push(`/manager/safety-education/create/select?${params.toString()}`);
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
          안전교육일지 작성
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          진행한 안전교육에 대해 일지를 작성합니다.
        </p>
      </header>

      {/* 기본 정보 섹션 */}
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
            <label className="mb-2 block text-sm text-brand-primary-strong">작성일자</label>
            <Input value={basicInfo.educationDate} disabled className="rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">작성자</label>
            <Input value={basicInfo.author} disabled className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* 교육 정보 섹션 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
        <h3 className="mb-4 text-lg font-normal text-brand-primary-strong">교육 정보</h3>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육 구분</label>
            <Radio.Group
              value={educationType}
              onChange={(e) => {
                setEducationType(e.target.value);
              }}
              className="flex flex-wrap gap-4"
            >
              <Radio value="REGULAR">정기교육</Radio>
              <Radio value="HIRING">채용 시 교육</Radio>
              <Radio value="WORK_CHANGE">작업내용 변경 시 교육</Radio>
              <Radio value="SPECIAL">특별교육</Radio>
              <Radio value="OTHER">기타</Radio>
            </Radio.Group>
          </div>

          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육과목</label>
            <Input
              value={educationSubject}
              onChange={(e) => setEducationSubject(e.target.value)}
              placeholder="예: 금속 절삭유 사용 시 안전사고 예방"
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육내용</label>
            <Input.TextArea
              value={educationContent}
              onChange={(e) => setEducationContent(e.target.value)}
              placeholder="예: 절삭유의 인체 유해성 및 예방조치 안내"
              rows={6}
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육 실시자 성명</label>
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="예: 김나나"
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-brand-primary-strong">교육 실시 장소</label>
            <Input
              value={educationLocation}
              onChange={(e) => setEducationLocation(e.target.value)}
              placeholder="예: 공장 내 회의실"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* 하단 액션 버튼 */}
      <section className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={handleCancel}>
          취소
        </Button>
        <Button variant="primary" size="md" onClick={handleNext}>
          다음 단계로
        </Button>
      </section>
    </div>
  );
}
