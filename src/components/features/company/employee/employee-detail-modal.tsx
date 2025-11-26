"use client";

import React from "react";
import { Modal, Tabs } from "antd";

import type {
  EmployeeContractDocument,
  EmployeeDetail,
  EmployeePayslipDocument,
} from "@/types/employee";

type EmployeeDetailModalProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeDetail | null;
  contracts: EmployeeContractDocument[];
  payslips: EmployeePayslipDocument[];
  siteName?: string;
  onOpenContract: (contract: EmployeeContractDocument) => void;
  onOpenPayslip: (payslip: EmployeePayslipDocument) => void;
};

export function EmployeeDetailModal({
  open,
  onClose,
  employee,
  contracts,
  payslips,
  siteName,
  onOpenContract,
  onOpenPayslip,
}: EmployeeDetailModalProps) {
  const subtitle = employee ? `${siteName ?? ""} | ${employee.joinDate} 기준` : (siteName ?? "");

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={900}
        classNames={{
          content: "bg-white",
          body: "p-0",
        }}
        styles={{
          content: {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <div className="flex flex-col rounded-2xl">
          {/* Header */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">
                  사원 상세 정보
                </p>
                <p className="mb-0! text-sm text-text-subtle">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[640px] overflow-y-auto px-6 py-5">
            {/* Basic info block */}
            <div className="mb-6 rounded-xl border border-border bg-bg-subtle px-6 py-5">
              <div className="grid gap-y-3 gap-x-8 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">이름</span>
                  <span className="text-base font-medium text-brand-primary-strong">
                    {employee?.name ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">구분</span>
                  <span className="text-base font-medium text-brand-primary-strong">
                    {employee ? (employee.employmentType === "REGULAR" ? "상용직" : "일용직") : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">주민등록번호</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.residentNumber ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">연락처</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.phone ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">입사일</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.joinDate ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">퇴사일</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.resignDate ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">이메일</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.email ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">비상연락망</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.emergencyContact ?? "-"}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <span className="text-sm text-text-subtle">주소</span>
                  <span className="text-base text-brand-primary-strong">
                    {employee?.address ?? "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents tabs */}
            <Tabs
              defaultActiveKey="contracts"
              items={[
                {
                  key: "contracts",
                  label: "근로계약서 목록",
                  children: (
                    <EmployeeDocumentTable
                      documents={contracts}
                      onOpen={(doc) => onOpenContract(doc as EmployeeContractDocument)}
                    />
                  ),
                },
                {
                  key: "payslips",
                  label: "급여명세서 목록",
                  children: (
                    <EmployeeDocumentTable
                      documents={payslips}
                      onOpen={(doc) => onOpenPayslip(doc as EmployeePayslipDocument)}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

type EmployeeDocumentTableProps = {
  documents: (EmployeeContractDocument | EmployeePayslipDocument)[];
  onOpen: (document: EmployeeContractDocument | EmployeePayslipDocument) => void;
};

function EmployeeDocumentTable({ documents, onOpen }: EmployeeDocumentTableProps) {
  return (
    <div className="mt-4 rounded-xl border border-border">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-[#f0f6fb]">
          <tr>
            <th className="border-b border-border px-4 py-3 text-center font-normal text-brand-primary-strong">
              문서명
            </th>
            <th className="border-b border-border px-4 py-3 text-center font-normal text-brand-primary-strong">
              작성일
            </th>
            <th className="border-b border-border px-4 py-3 text-center font-normal text-brand-primary-strong">
              상태
            </th>
            <th className="border-b border-border px-4 py-3 text-center font-normal text-brand-primary-strong">
              열람
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 text-center text-text-strong">{doc.title}</td>
              <td className="px-4 py-3 text-center text-text-subtle">{doc.createdAt}</td>
              <td className="px-4 py-3 text-center">
                <DocumentStatusPill status={doc.status} />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onOpen(doc)}
                  className="inline-flex h-8 min-w-[54px] items-center justify-center rounded-lg border border-brand-primary px-3 text-xs font-medium text-brand-primary hover:bg-brand-primary/5"
                >
                  열람
                </button>
              </td>
            </tr>
          ))}
          {documents.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-text-subtle" colSpan={4}>
                표시할 문서가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type DocumentStatusPillProps = {
  status: EmployeeContractDocument["status"];
};

function DocumentStatusPill({ status }: DocumentStatusPillProps) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        완료
      </span>
    );
  }

  if (status === "ONGOING") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
        진행중
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
      초안
    </span>
  );
}
