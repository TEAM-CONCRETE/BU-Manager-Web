"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSafetyEducationLogAttendees,
  type GetSafetyEducationLogAttendeesResponse,
} from "@/lib/api/get-safety-education-log-attendees";

type UseSafetyEducationLogAttendeesOptions = {
  enabled?: boolean;
};

export function useSafetyEducationLogAttendees(
  siteId: number,
  logId: number | null,
  options?: UseSafetyEducationLogAttendeesOptions,
) {
  return useQuery<GetSafetyEducationLogAttendeesResponse>({
    queryKey: ["safety-education-logs", "attendees", siteId, logId],
    queryFn: () => {
      if (logId == null) {
        throw new Error("안전교육일지 ID가 없습니다.");
      }
      return getSafetyEducationLogAttendees(siteId, logId);
    },
    enabled: (options?.enabled ?? true) && logId != null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
