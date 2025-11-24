"use client";

import { useState } from "react";

import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";
import { cn } from "@/utils/cn";

type LoginFormProps = {
  title: string;
  subtitle: string;
  description?: string;
  primaryButtonLabel: string;
  primaryButtonVariant?: ButtonProps["variant"];
  accentColorClass?: string;
  supportLink: {
    label: string;
    href: string;
  };
  signupLink: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export function LoginForm({
  title,
  subtitle,
  description,
  primaryButtonLabel,
  primaryButtonVariant = "primary",
  accentColorClass,
  supportLink,
  signupLink,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Placeholder for API call
    setTimeout(() => setIsSubmitting(false), 900);
  };

  const accentClass = accentColorClass ?? "text-brand-primary";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className={cn("text-3xl !font-bold", accentClass)}>{title}</h2>
        <p className="text-base text-text-base/80 dark:text-dark-text-base">{subtitle}</p>
        {description && <p className="text-sm text-text-subtle">{description}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="이메일"
            placeholder="name@company.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-text-subtle dark:text-dark-text-base">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-brand-primary focus:ring-brand-primary"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            자동 로그인
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          variant={primaryButtonVariant}
        >
          {isSubmitting ? "로그인 중..." : primaryButtonLabel}
        </Button>
      </form>

      <div className="flex flex-col gap-3 text-sm text-text-subtle dark:text-dark-text-base">
        <p className="flex flex-wrap items-center gap-2">
          <span>다른 계정으로 접속해야 하나요?</span>
          <Link
            href={supportLink.href}
            className={cn("font-semibold hover:underline", accentClass)}
          >
            {supportLink.label}
          </Link>
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span>아직 계정이 없다면</span>
          <Link
            href={signupLink.href}
            target={signupLink.external ? "_blank" : undefined}
            rel={signupLink.external ? "noopener noreferrer" : undefined}
            className={cn("font-semibold hover:underline", accentClass)}
          >
            {signupLink.label}
          </Link>
        </p>
      </div>
    </div>
  );
}
