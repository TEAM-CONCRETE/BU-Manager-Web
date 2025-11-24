"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button/button";

const headerLinks = ["솔루션", "고객 사례", "요금제", "자료실"];

export function LandingHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur dark:border-dark-border dark:bg-dark-bg-surface/90">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center">
            <Image
              src="/assets/service_logo.svg"
              alt="Build-Up"
              width={40}
              height={40}
              priority
              className="h-full w-full object-cover scale-[1.25]"
            />
          </div>
          <p className="mb-0! text-3xl font-extrabold tracking-tight text-brand-primary">
            Build-Up
          </p>
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold text-text-subtle dark:text-dark-text-base">
          {headerLinks.map((link) => (
            <Link key={link} href="#" className="transition-colors hover:text-brand-primary">
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="md" variant="primary">
            기업 로그인
          </Button>
          <Button size="md" variant="ghost" className="border-brand-primary text-brand-primary">
            관리자 로그인
          </Button>
          <Button size="md" variant="ghost" className="border-border text-text-subtle">
            관리자 회원가입
          </Button>
        </div>
      </div>
    </header>
  );
}
