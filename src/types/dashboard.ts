export type SiteInfo = {
  siteId: number;
  siteName: string;
  siteAddress: string;
  clientName: string;
  startDate: string;
  endDate: string;
  progressRate: number;
  managerName: string;
};

export type WorkforceStatus = {
  totalWorkers: number;
  permanentWorkers: number;
  dailyWorkers: number;
  todayAttendance: number;
  todayLateCount: number;
};

export type SafetyStatus = {
  safetyRate: number;
  todayWarnings: number;
  incompletedEducation: number;
  completedInspections: number;
};

export type PendingContract = {
  contractId: number;
  contractType: string;
  targetName: string;
  contractState: string;
};

export type LaborStatus = {
  totalPendingContracts: number;
  pendingContracts: PendingContract[];
};

export type SiteDashboard = {
  siteInfo: SiteInfo;
  workforceStatus: WorkforceStatus;
  safetyStatus: SafetyStatus;
  laborStatus: LaborStatus;
};

export type GetSiteDashboardApiResponse = {
  success: boolean;
  message: string;
  data: SiteDashboard;
};
