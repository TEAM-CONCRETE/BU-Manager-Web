"use client";

import { useMutation } from "@tanstack/react-query";

import { useSessionStore } from "@/stores/session-store";

import { login, type LoginPayload } from "@/lib/api/login";
import { mapRoleToSessionRole, type RawRole } from "@/utils/map-role";

type UseLoginMutationOptions = {
  allowedRoles?: RawRole[];
  roleMismatchMessages?: Partial<Record<RawRole, string>>;
};

export function useLoginMutation(options: UseLoginMutationOptions = {}) {
  const setUser = useSessionStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      const mappedRole = mapRoleToSessionRole(data.role);
      if (!mappedRole) {
        return;
      }

      if (options?.allowedRoles && !options.allowedRoles.includes(data.role)) {
        const message =
          options.roleMismatchMessages?.[data.role] ??
          "해당 계정으로는 이 페이지에서 로그인할 수 없습니다.";
        throw new Error(message);
      }

      setUser({
        id: data.userId,
        name: data.userName,
        email: data.userId,
        role: mappedRole,
      });
    },
  });
}
