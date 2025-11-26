"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getEmployeeContracts,
  getEmployeeDetail,
  getEmployeePayslips,
} from "@/lib/api/get-employees";
import type {
  EmployeeContractDocument,
  EmployeeDetail,
  EmployeePayslipDocument,
} from "@/types/employee";

type UseEmployeeDetailParams = {
  siteId: number;
  employeeId: number | null;
};

export function useEmployeeDetail({ siteId, employeeId }: UseEmployeeDetailParams) {
  const enabled = employeeId != null;

  const { data: employee } = useQuery<EmployeeDetail | null>({
    queryKey: ["employee", "detail", siteId, employeeId],
    queryFn: () =>
      employeeId != null ? getEmployeeDetail({ siteId, employeeId }) : Promise.resolve(null),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  const { data: contractsData } = useQuery({
    queryKey: ["employee", "contracts", siteId, employeeId],
    queryFn: () =>
      getEmployeeContracts({
        siteId,
        employeeId: employeeId!,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  const { data: payslipsData } = useQuery({
    queryKey: ["employee", "payslips", siteId, employeeId],
    queryFn: () =>
      getEmployeePayslips({
        siteId,
        employeeId: employeeId!,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  const contracts: EmployeeContractDocument[] = contractsData?.contracts ?? [];
  const payslips: EmployeePayslipDocument[] = payslipsData?.payslips ?? [];

  return {
    employee,
    contracts,
    payslips,
  };
}
