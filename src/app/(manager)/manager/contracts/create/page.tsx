"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Checkbox, DatePicker, Input, Radio, TimePicker } from "antd";
import { useSearchParams } from "next/navigation";
import { useContractInfo } from "@/hooks/use-contract-info";
import { useSessionStore } from "@/stores/session-store";

const weekdayLabels = [
  { key: "MON", label: "월요일" },
  { key: "TUE", label: "화요일" },
  { key: "WED", label: "수요일" },
  { key: "THU", label: "목요일" },
  { key: "FRI", label: "금요일" },
  { key: "SAT", label: "토요일" },
  { key: "SUN", label: "일요일" },
];

type WeekdayKey = (typeof weekdayLabels)[number]["key"];

type ScheduleEntry = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakTime: string;
};

const defaultSchedule: Record<WeekdayKey, ScheduleEntry> = {
  MON: { enabled: true, startTime: "08:30", endTime: "17:30", breakTime: "1" },
  TUE: { enabled: true, startTime: "09:00", endTime: "18:00", breakTime: "1" },
  WED: { enabled: true, startTime: "08:00", endTime: "16:00", breakTime: "1" },
  THU: { enabled: false, startTime: "", endTime: "", breakTime: "1" },
  FRI: { enabled: true, startTime: "08:30", endTime: "17:30", breakTime: "1" },
  SAT: { enabled: true, startTime: "09:00", endTime: "15:00", breakTime: "0.5" },
  SUN: { enabled: false, startTime: "", endTime: "", breakTime: "1" },
};

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const normalized = value.replace(/\./g, "-");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getWeekdayKey(date: Date): WeekdayKey {
  const idx = date.getDay();
  return weekdayLabels[idx === 0 ? 6 : idx - 1].key;
}

const { RangePicker } = DatePicker;

export default function ManagerContractCreatePage() {
  const searchParams = useSearchParams();
  const empType = searchParams.get("empType");
  const employeeName = searchParams.get("employeeName");
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId != null ? Number(user.siteId) : null;
  const hasValidSiteId = parsedSiteId != null && !Number.isNaN(parsedSiteId);
  const today = dayjs().format("YYYY.MM.DD");
  const { data: contractInfoData } = useContractInfo(parsedSiteId, { enabled: hasValidSiteId });

  const isPermanent = empType === "PERMANENT";

  const [basicInfo, setBasicInfo] = useState({
    employerName: "",
    employeeName: employeeName ?? "",
    writtenDate: today,
    representativeName: "",
    address: "",
  });

  const [contractInfo, setContractInfo] = useState({
    startDate: today,
    endDate: today,
    jobType: "",
    workplace: "",
  });

  const [wageInfo, setWageInfo] = useState({
    baseWage: "100000",
    hasBonus: false,
    overtimeAllowance: "10000",
    nightAllowance: "15000",
    holidayAllowance: "20000",
  });

  const [payInfo, setPayInfo] = useState({
    payDate: "10",
    payCycle: "monthly",
    payMethod: "transfer",
    socialInsurances: ["고용보험", "산재보험"],
  });

  const [schedule, setSchedule] = useState<Record<WeekdayKey, ScheduleEntry>>(defaultSchedule);

  const handleContractPeriodChange = (values: Dayjs[] | null) => {
    if (!values || values.length !== 2) return;
    setContractInfo((prev) => ({
      ...prev,
      startDate: values[0].format("YYYY.MM.DD"),
      endDate: values[1].format("YYYY.MM.DD"),
    }));
  };

  const activeWeekdays = useMemo(() => {
    const start = parseDateInput(contractInfo.startDate);
    const end = parseDateInput(contractInfo.endDate);
    if (!start || !end || end < start) {
      return weekdayLabels.map((item) => item.key);
    }

    const days: WeekdayKey[] = [];
    const current = new Date(start);
    while (current <= end) {
      const key = getWeekdayKey(current);
      if (!days.includes(key)) {
        days.push(key);
      }
      current.setDate(current.getDate() + 1);
      if (days.length === weekdayLabels.length) break;
    }
    return days.length > 0 ? days : weekdayLabels.map((item) => item.key);
  }, [contractInfo.startDate, contractInfo.endDate]);

  const handleScheduleChange = (
    key: WeekdayKey,
    field: keyof ScheduleEntry,
    value: string | boolean,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === "enabled" ? Boolean(value) : String(value),
      },
    }));
  };

  const socialInsuranceOptions = ["고용보험", "산재보험", "국민연금", "건강보험"];

  useEffect(() => {
    setBasicInfo((prev) => ({
      ...prev,
      employeeName: employeeName ?? prev.employeeName,
    }));
  }, [employeeName]);

  useEffect(() => {
    if (!contractInfoData) return;
    setBasicInfo((prev) => ({
      ...prev,
      employerName: contractInfoData.corporation?.corpName ?? prev.employerName,
      representativeName: contractInfoData.corporation?.corpCeoName ?? prev.representativeName,
      address: contractInfoData.corporation?.corpAddress ?? prev.address,
    }));
    setContractInfo((prev) => ({
      ...prev,
      workplace: contractInfoData.siteAddress ?? prev.workplace,
    }));
  }, [contractInfoData]);

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <header className="space-y-1">
        <p className="mb-0! text-2xl font-semibold! text-text-strong">
          {isPermanent ? "상용직" : "일용직"} 근로계약서 작성
        </p>
        <p className="mb-0! text-sm text-text-subtle">
          {employeeName
            ? `${employeeName}님의 근로조건을 입력하고 전자계약서를 생성하세요.`
            : "근로자 정보를 입력하고 전자계약서를 생성하세요."}
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 space-y-4">
        <div>
          <p className="mb-1! text-sm font-semibold text-text-strong">기본 정보</p>
          <p className="mb-0! text-xs text-text-subtle">
            계약서 상단에 표기되는 기본 정보를 입력하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1! text-xs text-text-subtle">사업주 이름</p>
            <Input
              size="large"
              value={basicInfo.employerName}
              disabled
              onChange={(e) => setBasicInfo((prev) => ({ ...prev, employerName: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">근로자 이름</p>
            <Input
              size="large"
              value={basicInfo.employeeName}
              disabled
              onChange={(e) => setBasicInfo((prev) => ({ ...prev, employeeName: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">작성일자</p>
            <Input
              size="large"
              value={basicInfo.writtenDate}
              disabled
              onChange={(e) => setBasicInfo((prev) => ({ ...prev, writtenDate: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">대표자 이름</p>
            <Input
              size="large"
              value={basicInfo.representativeName}
              disabled
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, representativeName: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <p className="mb-1! text-xs text-text-subtle">주소</p>
            <Input
              size="large"
              value={basicInfo.address}
              disabled
              onChange={(e) => setBasicInfo((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 space-y-4">
        <div>
          <p className="mb-1! text-sm font-semibold text-text-strong">계약 기본 정보</p>
          <p className="mb-0! text-xs text-text-subtle">
            계약 기간과 근무 장소, 직종을 입력하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="mb-1! text-xs text-text-subtle">근로계약기간</p>
            <RangePicker
              size="large"
              className="w-full"
              format="YYYY.MM.DD"
              value={[
                dayjs(contractInfo.startDate.replace(/\./g, "-")),
                dayjs(contractInfo.endDate.replace(/\./g, "-")),
              ]}
              onChange={(values) => handleContractPeriodChange(values as Dayjs[] | null)}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">직종</p>
            <Input
              size="large"
              value={contractInfo.jobType}
              onChange={(e) => setContractInfo((prev) => ({ ...prev, jobType: e.target.value }))}
            />
          </div>
          <div className="md:col-span-3">
            <p className="mb-1! text-xs text-text-subtle">근무 장소</p>
            <Input
              size="large"
              value={contractInfo.workplace}
              disabled
              onChange={(e) => setContractInfo((prev) => ({ ...prev, workplace: e.target.value }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 space-y-4">
        <div>
          <p className="mb-1! text-sm font-semibold text-text-strong">요일별 근무시간 설정</p>
          <p className="mb-0! text-xs text-text-subtle">
            계약 기간에 해당하는 요일만 표시되며, 각 요일의 근무 여부와 시간을 입력할 수 있습니다.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-subtle text-text-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-medium">요일</th>
                <th className="px-4 py-3 text-center font-medium">근무 여부</th>
                <th className="px-4 py-3 text-center font-medium">출근 시간</th>
                <th className="px-4 py-3 text-center font-medium">퇴근 시간</th>
                <th className="px-4 py-3 text-center font-medium">휴게 시간</th>
              </tr>
            </thead>
            <tbody>
              {activeWeekdays.map((key) => {
                const label = weekdayLabels.find((item) => item.key === key)?.label ?? key;
                const entry = schedule[key];
                return (
                  <tr key={key} className="border-t border-border">
                    <td className="px-4 py-3">{label}</td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={entry.enabled}
                        onChange={(e) => handleScheduleChange(key, "enabled", e.target.checked)}
                      >
                        근무
                      </Checkbox>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TimePicker
                        size="small"
                        format="HH:mm"
                        minuteStep={10}
                        className="w-24"
                        disabled={!entry.enabled}
                        value={entry.startTime ? dayjs(entry.startTime, "HH:mm") : null}
                        onChange={(time) =>
                          handleScheduleChange(key, "startTime", time ? time.format("HH:mm") : "")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TimePicker
                        size="small"
                        format="HH:mm"
                        minuteStep={10}
                        className="w-24"
                        disabled={!entry.enabled}
                        value={entry.endTime ? dayjs(entry.endTime, "HH:mm") : null}
                        onChange={(time) =>
                          handleScheduleChange(key, "endTime", time ? time.format("HH:mm") : "")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-20">
                          <Input
                            size="small"
                            value={entry.breakTime}
                            disabled={!entry.enabled}
                            onChange={(e) => handleScheduleChange(key, "breakTime", e.target.value)}
                            className="text-center"
                          />
                        </div>
                        <span className="text-xs text-text-subtle">시간</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 space-y-4">
        <div>
          <p className="mb-1! text-sm font-semibold text-text-strong">임금 및 수당 정보</p>
          <p className="mb-0! text-xs text-text-subtle">기본 임금과 각종 수당을 입력하세요.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1! text-xs text-text-subtle">기본 임금</p>
            <Input
              size="large"
              suffix="원"
              value={wageInfo.baseWage}
              onChange={(e) => setWageInfo((prev) => ({ ...prev, baseWage: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">상여금 여부</p>
            <div className="flex items-center gap-4">
              <Radio.Group
                value={wageInfo.hasBonus ? "yes" : "no"}
                onChange={(e) =>
                  setWageInfo((prev) => ({ ...prev, hasBonus: e.target.value === "yes" }))
                }
              >
                <Radio value="yes">있음</Radio>
                <Radio value="no">없음</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1! text-xs text-text-subtle">시간 외 근로 수당</p>
            <Input
              size="large"
              suffix="원/시간"
              value={wageInfo.overtimeAllowance}
              onChange={(e) =>
                setWageInfo((prev) => ({ ...prev, overtimeAllowance: e.target.value }))
              }
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">야간 근로 수당</p>
            <Input
              size="large"
              suffix="원/시간"
              value={wageInfo.nightAllowance}
              onChange={(e) => setWageInfo((prev) => ({ ...prev, nightAllowance: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">휴일 근로 수당</p>
            <Input
              size="large"
              suffix="원/시간"
              value={wageInfo.holidayAllowance}
              onChange={(e) =>
                setWageInfo((prev) => ({ ...prev, holidayAllowance: e.target.value }))
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-5 space-y-4">
        <div>
          <p className="mb-1! text-sm font-semibold text-text-strong">임금 지급 정보</p>
          <p className="mb-0! text-xs text-text-subtle">임금 지급일과 주기, 방법을 입력하세요.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1! text-xs text-text-subtle">임금 지급일</p>
            <Input
              size="large"
              value={payInfo.payDate}
              inputMode="numeric"
              suffix="일"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setPayInfo((prev) => ({ ...prev, payDate: digitsOnly }));
              }}
            />
          </div>
          <div>
            <p className="mb-1! text-xs text-text-subtle">임금 지급 주기</p>
            <Radio.Group
              value={payInfo.payCycle}
              onChange={(e) => setPayInfo((prev) => ({ ...prev, payCycle: e.target.value }))}
              className="flex gap-4"
            >
              <Radio value="monthly">월급</Radio>
              <Radio value="weekly">주급</Radio>
              <Radio value="daily">일급</Radio>
            </Radio.Group>
          </div>
        </div>
        <div>
          <p className="mb-1! text-xs text-text-subtle">지급 방법</p>
          <Radio.Group
            value={payInfo.payMethod}
            onChange={(e) => setPayInfo((prev) => ({ ...prev, payMethod: e.target.value }))}
            className="flex gap-4"
          >
            <Radio value="cash">현금</Radio>
            <Radio value="transfer">계좌이체</Radio>
          </Radio.Group>
        </div>
        <div>
          <p className="mb-1! text-xs text-text-subtle">사회보험 적용 여부</p>
          <Checkbox.Group
            value={payInfo.socialInsurances}
            onChange={(checked) =>
              setPayInfo((prev) => ({ ...prev, socialInsurances: checked as string[] }))
            }
            className="flex flex-wrap gap-4"
          >
            {socialInsuranceOptions.map((option) => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      </section>
    </div>
  );
}
