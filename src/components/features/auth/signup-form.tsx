"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";
import { checkUserId } from "@/lib/api/check-user-id";
import { registerManager } from "@/lib/api/register-manager";

export function SiteManagerSignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idStatusMessage, setIdStatusMessage] = useState<string | null>(null);
  const [idStatus, setIdStatus] = useState<"idle" | "error" | "success">("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const duplicateMutation = useMutation({
    mutationFn: checkUserId,
    onSuccess: (exists) => {
      if (exists) {
        setIdStatus("error");
        setIdStatusMessage("이미 존재하는 ID입니다.");
      } else {
        setIdStatus("success");
        setIdStatusMessage("사용 가능한 ID입니다.");
      }
    },
    onError: (error: Error) => {
      setIdStatus("error");
      setIdStatusMessage(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerManager,
    onSuccess: () => {
      setFormError(null);
      setFormMessage("회원가입 신청이 완료되었습니다. 승인 안내를 확인해주세요.");
      notification.success({
        message: "회원가입이 완료되었습니다.",
        placement: "topRight",
        duration: 2,
      });
      setTimeout(() => {
        router.push("/login/site-manager");
      }, 300);
    },
    onError: (error: Error) => {
      setFormMessage(null);
      setFormError(error.message);
      notification.error({
        message: error.message,
        placement: "topRight",
        duration: 2,
      });
    },
  });

  const handleDuplicateCheck = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userId) {
      setIdStatus("error");
      setIdStatusMessage("아이디를 입력한 뒤 중복 확인을 진행해주세요.");
      return;
    }
    duplicateMutation.mutate(userId);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);
    registerMutation.mutate({
      managerName: name,
      userId,
      password,
      confirmPassword,
      secretKey,
      phone: phoneNumber,
      passwordMatching: password === confirmPassword,
    });
  };

  const isDisabled =
    !name ||
    !userId ||
    !password ||
    !confirmPassword ||
    !secretKey ||
    !phoneNumber ||
    password.length < 8 ||
    password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-text-strong dark:text-dark-text-strong">
      <header className="space-y-3">
        <h1 className="text-3xl !font-bold">회원가입</h1>
        <p className="text-sm text-text-subtle dark:text-dark-text-base">
          Build-Up 현장 관리자 계정을 생성하고 현장 데이터를 효율적으로 관리하세요.
        </p>
      </header>

      <div className="space-y-5">
        <Input
          label="성함"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-strong dark:text-dark-text-strong">ID</p>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
            <Input
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setIdStatus("idle");
                setIdStatusMessage(null);
              }}
              variant={idStatus === "error" ? "error" : "default"}
              required
            />
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-xl border border-brand-primary px-6 text-brand-primary sm:self-start"
              onClick={handleDuplicateCheck}
              disabled={duplicateMutation.isPending}
            >
              {duplicateMutation.isPending ? "확인 중..." : "중복 확인"}
            </Button>
          </div>
          {idStatus === "error" ? (
            <p className="text-sm text-state-danger">{idStatusMessage}</p>
          ) : idStatus === "success" ? (
            <p className="text-sm text-brand-primary">사용 가능한 ID입니다.</p>
          ) : null}
        </div>

        <Input
          label="PW"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={
            confirmPassword && confirmPassword !== password
              ? "비밀번호가 일치하지 않습니다."
              : undefined
          }
        />

        <Input
          label="Secret Key"
          placeholder="시크릿 키를 입력해주세요"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />

        <Input
          label="전화번호"
          placeholder="전화번호를 입력해주세요"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        {formError ? (
          <p className="text-sm font-semibold text-state-danger">{formError}</p>
        ) : formMessage ? (
          <p className="text-sm font-semibold text-brand-primary">{formMessage}</p>
        ) : null}
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl bg-brand-primary text-white hover:bg-brand-primary-strong"
          disabled={isDisabled || registerMutation.isPending}
        >
          {registerMutation.isPending ? "진행 중..." : "확인"}
        </Button>
        <p className="!mt-2 text-center text-sm text-text-subtle dark:text-dark-text-base">
          이미 계정이 있으신가요?{" "}
          <Link href="/login/site-manager" className="font-semibold text-brand-primary">
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
