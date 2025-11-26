export type SafetyEducationLog = {
  logId: number;
  status: "MANAGER_SIGNING_PENDING" | "MANAGER_SIGNED" | "COMPLETED";
  educationSubject: string;
};

export type WorkReport = {
  workReportId: number;
  sequence: number;
};

export type SafetyWorkDocumentContent = {
  date: string;
  safetyEducationLog: SafetyEducationLog | null;
  workReport: WorkReport | null;
};

export type SafetyWorkDocumentsApiResponse = {
  success: boolean;
  message: string;
  data: {
    content: SafetyWorkDocumentContent[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
};

// Frontend Types (for compatibility with existing components)
export type SafetyWorkRecord = {
  id: string;
  date: string;
  safetyDiaryAvailable: boolean;
  workReportAvailable: boolean;
  safetyDiaryUrl?: string;
  workReportUrl?: string;
  safetyEducationLog?: SafetyEducationLog | null;
  workReport?: WorkReport | null;
};

export type GetSafetyWorkRecordsResponse = {
  summary: {
    totalCount: number;
  };
  records: SafetyWorkRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
};

export type GetSafetyWorkRecordsParams = {
  siteId: number;
  year: string;
  month: string;
  page?: number;
  size?: number;
};

// PDF URL 가져오기
export type GetSafetyDocumentPdfApiResponse = {
  success: boolean;
  message: string;
  code?: string | null;
  data: {
    url: string;
    expiresAt: string;
  } | null;
};
