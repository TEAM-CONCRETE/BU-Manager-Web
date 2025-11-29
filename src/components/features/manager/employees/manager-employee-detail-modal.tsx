"use client";

import { Modal } from "antd";
import dayjs from "dayjs";
import type { EmployeeContractDocument, EmployeeDetail } from "@/types/employee";
import { formatPhone } from "@/utils/phone";
import { cn } from "@/utils/cn";

type ManagerEmployeeDetailModalProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeDetail | null;
  contracts: EmployeeContractDocument[];
  siteName?: string;
  onOpenContract?: (contract: EmployeeContractDocument) => void;
};

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  try {
    return dayjs(dateString).format("YYYY.MM.DD");
  } catch {
    return dateString;
  }
}

export function ManagerEmployeeDetailModal({
  open,
  onClose,
  employee,
  contracts,
  siteName,
  onOpenContract,
}: ManagerEmployeeDetailModalProps) {
  const currentDate = dayjs().format("YYYY년 M월");
  const subtitle = employee ? `${siteName ?? ""} | ${currentDate} 기준` : (siteName ?? "");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={896}
      classNames={{
        content: "bg-white",
        body: "p-0",
      }}
      styles={{
        content: {
          backgroundColor: "#ffffff",
        },
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <div className="flex flex-col">
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-0! text-xl font-semibold text-brand-primary-strong">
                사원 상세 정보
              </p>
              <p className="mb-0! text-sm text-text-subtle">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="max-h-[654px] overflow-y-auto px-6 py-6">
          <div className="mb-6 rounded-xl border border-border bg-bg-subtle px-6 py-5">
            <div className="grid gap-y-5 gap-x-8 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">이름</span>
                <span className="text-base font-normal text-brand-primary-strong">
                  {employee?.name ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">구분</span>
                <span className="text-base font-normal text-brand-primary-strong text-right">
                  {employee
                    ? employee.employmentType === "REGULAR"
                      ? "상용직"
                      : employee.employmentType === "DAILY"
                        ? "일용직"
                        : "-"
                    : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">주민등록번호</span>
                <span className="text-base font-normal text-brand-primary-strong">
                  {employee?.residentNumber ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">연락처</span>
                <span className="text-base font-normal text-brand-primary-strong text-right">
                  {employee?.phone ? formatPhone(employee.phone) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">입사일</span>
                <span className="text-base font-normal text-brand-primary-strong">
                  {formatDate(employee?.joinDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-subtle">퇴사일</span>
                <span className="text-base font-normal text-brand-primary-strong">
                  {formatDate(employee?.resignDate)}
                </span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <span className="text-sm text-text-subtle">이메일</span>
                <span className="text-base font-normal text-brand-primary-strong text-right">
                  {employee?.email ?? "-"}
                </span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <span className="text-sm text-text-subtle">주소</span>
                <span className="text-base font-normal text-brand-primary-strong text-right">
                  {employee?.address ?? "-"}
                </span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <span className="text-sm text-text-subtle">비상연락망</span>
                <span className="text-base font-normal text-brand-primary-strong">
                  {employee?.emergencyContact ? formatPhone(employee.emergencyContact) : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <button
                type="button"
                className="rounded-lg bg-brand-primary-strong px-4 py-2 text-sm font-normal !text-white"
              >
                근로계약서 목록
              </button>
            </div>

            <div className="rounded-xl border border-border bg-white">
              <table className="w-full">
                <thead className="bg-[#f0f6fb]">
                  <tr>
                    <th className="border-b border-border px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                      문서명
                    </th>
                    <th className="border-b border-border px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                      작성일
                    </th>
                    <th className="border-b border-border px-4 py-3 text-center text-sm font-normal text-brand-primary-strong">
                      열람
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-4 text-center text-sm text-text-strong">
                        {contract.title}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-text-subtle">
                        {formatDate(contract.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenContract) {
                              onOpenContract(contract);
                            }
                          }}
                          className={cn(
                            "inline-flex h-[30px] min-w-[54px] items-center justify-center rounded-lg border px-3 text-sm font-normal transition",
                            "border-brand-primary text-brand-primary hover:bg-brand-primary/5",
                          )}
                        >
                          조회
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contracts.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-sm text-text-subtle" colSpan={3}>
                        표시할 문서가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
