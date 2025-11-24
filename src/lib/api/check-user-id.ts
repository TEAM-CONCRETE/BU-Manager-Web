export type CheckUserIdResponse = {
  success: boolean;
  message: string;
  code: string;
  data: {
    exists: boolean;
  };
};

export async function checkUserId(userId: string) {
  const response = await fetch(`/api/v1/auth/exists?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("아이디 중복 확인 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as CheckUserIdResponse;
  if (!json.success) {
    throw new Error(json.message || "아이디 중복 확인 중 오류가 발생했습니다.");
  }

  return json.data.exists;
}
