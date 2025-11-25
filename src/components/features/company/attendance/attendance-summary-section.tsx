import type { AttendanceSummary } from "@/lib/api/get-attendance-records";

import { AttendanceSummaryCard } from "@/components/features/company/attendance/attendance-summary-card";

type AttendanceSummarySectionProps = {
  summary?: AttendanceSummary;
};

export function AttendanceSummarySection({ summary }: AttendanceSummarySectionProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AttendanceSummaryCard
        label="정상 출근"
        value={`${summary?.normalAttendance ?? 0}명`}
        dotColor="bg-green-500"
        textColor="text-green-600"
      />
      <AttendanceSummaryCard
        label="지각"
        value={`${summary?.late ?? 0}명`}
        dotColor="bg-yellow-400"
        textColor="text-yellow-600"
      />
      <AttendanceSummaryCard
        label="조퇴"
        value={`${summary?.earlyLeave ?? 0}명`}
        dotColor="bg-orange-500"
        textColor="text-orange-600"
      />
      <AttendanceSummaryCard
        label="결근"
        value={`${summary?.absent ?? 0}명`}
        dotColor="bg-red-500"
        textColor="text-red-600"
      />
    </div>
  );
}
