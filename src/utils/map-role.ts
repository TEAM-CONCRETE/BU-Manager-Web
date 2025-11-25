import type { SessionUser } from "@/stores/session-store";

export type RawRole = "ROLE_EMPLOYEE" | "ROLE_MANAGER" | "ROLE_CORPORATION";

export function mapRoleToSessionRole(role: RawRole): SessionUser["role"] | null {
  if (role === "ROLE_MANAGER") return "siteManager";
  if (role === "ROLE_CORPORATION") return "company";
  return null;
}
