"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceRecords,
  type AttendanceRequestParams,
} from "@/lib/api/get-attendance";

type UseAttendanceRecordsOptions = AttendanceRequestParams & {
  enabled?: boolean;
};

export function useAttendanceRecords({
  enabled = true,
  ...params
}: UseAttendanceRecordsOptions) {
  return useQuery({
    queryKey: ["attendance-records", params.siteId, params.employmentType, params.date],
    queryFn: () => getAttendanceRecords(params),
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
