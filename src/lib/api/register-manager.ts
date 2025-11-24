export type RegisterManagerPayload = {
  managerName: string;
  userId: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
  phone: string;
  passwordMatching: boolean;
};

export type RegisterManagerResponse = {
  success: boolean;
  message: string;
  code: string;
  data: unknown;
};

export async function registerManager(payload: RegisterManagerPayload) {
  const response = await fetch("/api/v1/auth/register/manager", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }

  const json = (await response.json()) as RegisterManagerResponse;

  if (!json.success) {
    throw new Error(json.message || "회원가입 중 오류가 발생했습니다.");
  }

  return json.data;
}
