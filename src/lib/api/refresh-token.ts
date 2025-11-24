import type { LoginApiResponse } from "@/lib/api/login";

export async function refreshToken() {
  const response = await fetch("/api/v1/auth/token/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("세션을 복구할 수 없습니다.");
  }

  const json = (await response.json()) as LoginApiResponse;
  if (!json.success) {
    throw new Error(json.message || "세션을 복구할 수 없습니다.");
  }

  return json.data;
}
