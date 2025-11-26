export type EmploymentType = "REGULAR" | "DAILY";

export type EmployeeDocumentStatus = "DRAFT" | "ONGOING" | "COMPLETED";

export type EmployeeContractDocument = {
  id: number;
  name: string;
  createdAt: string;
  status: EmployeeDocumentStatus;
  pdfUrl?: string;
};

export type EmployeePayslipDocument = {
  id: number;
  name: string;
  createdAt: string;
  status: EmployeeDocumentStatus;
  pdfUrl?: string;
};

export type EmployeeRecord = {
  id: number;
  siteId: number;
  name: string;
  residentNumber: string;
  employmentType: EmploymentType;
  joinDate: string;
  resignDate?: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyContactName?: string;
  contracts: EmployeeContractDocument[];
  payslips: EmployeePayslipDocument[];
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
