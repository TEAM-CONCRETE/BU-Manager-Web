"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";

export function SiteManagerSignupForm() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idStatusMessage, setIdStatusMessage] = useState<string | null>(null);
  const [idStatus, setIdStatus] = useState<"idle" | "error" | "success">("idle");

  const handleDuplicateCheck = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO: 실제 중복 확인 API 연동
    setIdStatus("error");
    setIdStatusMessage("이미 존재하는 ID입니다.");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: 회원가입 API 연동
  };

  const isDisabled =
    !name || !userId || !password || !secretKey || !phoneNumber || password.length < 8;

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
            >
              중복 확인
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
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl bg-brand-primary text-white hover:bg-brand-primary-strong"
          disabled={isDisabled}
        >
          확인
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
1;
