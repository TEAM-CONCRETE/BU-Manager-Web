import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceRecords,
  type GetAttendanceRecordsParams,
  type GetAttendanceRecordsResponse,
} from "@/lib/api/get-attendance-records";

type UseAttendanceRecordsOptions = {
  enabled?: boolean;
};

export function useAttendanceRecords(
  params: GetAttendanceRecordsParams,
  options?: UseAttendanceRecordsOptions,
) {
  const queryClient = useQueryClient();
  const queryKey = [
    "attendance",
    "records",
    params.siteId,
    params.year,
    params.month,
    params.day,
    params.employmentType,
    params.page,
    params.size,
  ] as const;

  const cachedData = queryClient.getQueryData<GetAttendanceRecordsResponse["data"]>(queryKey);

  return useQuery<GetAttendanceRecordsResponse["data"]>({
    queryKey,
    queryFn: () => getAttendanceRecords(params),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    enabled: options?.enabled ?? !cachedData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
}
