export type EmploymentType = "REGULAR" | "DAILY";

export type EmployeeRecord = {
  id: number;
  name: string;
  residentNumber: string;
  employmentType: EmploymentType;
};

export type EmployeeDetail = {
  id: number;
  name: string;
  residentNumber: string;
  employmentType: EmploymentType;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  joinDate: string;
  resignDate?: string;
};

export type EmployeeDocumentStatus = "DRAFT" | "ONGOING" | "COMPLETED" | string;

export type EmployeeContractDocument = {
  id: number;
  title: string;
  createdAt: string;
  status: EmployeeDocumentStatus;
};

export type EmployeePayslipDocument = {
  id: number;
  title: string;
  createdAt: string;
  status: EmployeeDocumentStatus;
};

export type GetEmployeeListParams = {
  siteId: number;
  employmentType: EmploymentType;
  page: number;
  size: number;
  searchKeyword?: string;
};

export type EmployeeListPagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
};

export type GetEmployeeListResponse = {
  summary: {
    totalCount: number;
  };
  records: EmployeeRecord[];
  pagination: EmployeeListPagination;
};

export type GetEmployeeDetailParams = {
  siteId: number;
  employeeId: number;
};

export type GetEmployeeContractsParams = {
  siteId: number;
  employeeId: number;
};

export type GetEmployeePayslipsParams = {
  siteId: number;
  employeeId: number;
};

export type GetEmployeeContractsResponse = {
  employeeId: number;
  contracts: EmployeeContractDocument[];
};

export type GetEmployeePayslipsResponse = {
  employeeId: number;
  payslips: EmployeePayslipDocument[];
};

export type GetEmployeeDocumentPdfApiResponse = {
  success: boolean;
  message: string;
  data?: {
    url: string;
    expiresAt: string;
  };
};
