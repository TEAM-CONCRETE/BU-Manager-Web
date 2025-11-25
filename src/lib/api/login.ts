export type LoginPayload = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type LoginApiResponse = {
  success: boolean;
  message: string;
  code: string;
  data: {
    userId: string;
    userName: string;
    role: "ROLE_EMPLOYEE" | "ROLE_MANAGER" | "ROLE_CORPORATION";
    expiresIn: number;
    employeeId?: number;
    siteId?: number;
  };
};

export async function login(payload: LoginPayload) {
  let response: Response;
  try {
    response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }

  const fallbackMessage = "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  const statusMessages: Record<number, string> = {
    400: "요청 형식이 올바르지 않습니다.",
    401: "아이디 또는 비밀번호를 확인해주세요.",
    403: "접근 권한이 없습니다.",
    404: "서비스를 찾을 수 없습니다.",
    500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  };

  let json: LoginApiResponse | { message?: string } | null = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const message =
      (json && typeof json === "object" && "message" in json && typeof json.message === "string"
        ? json.message
        : undefined) ||
      statusMessages[response.status] ||
      fallbackMessage;

    throw new Error(message);
  }

  const data = json as LoginApiResponse | null;

  if (!data?.success) {
    throw new Error(data?.message || fallbackMessage);
  }

  if (data.data.role === "ROLE_EMPLOYEE") {
    throw new Error("근로자 계정은 웹 대시보드에 접근할 수 없습니다.");
  }

  return data.data;
}
