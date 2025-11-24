"use client";

import { Button } from "@/components/ui/Button/button";

import { footerColumns } from "./constants";

export function LandingFooter() {
  return (
    <footer className="flex min-h-screen w-full snap-start items-stretch bg-brand-primary text-white dark:bg-brand-primary/90">
      <div className="w-full px-6 py-16 lg:px-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold">Build-Up</p>
            <p className="text-sm text-white/80">
              건설현장의 계약부터 안전까지 모든 노무 업무를 연결해 투명한 현장을 만듭니다.
            </p>
          </div>

          <div className="space-y-6">
            {footerColumns.map((column) => (
              <div key={column.heading} className="space-y-3">
                <p className="text-base font-semibold">{column.heading}</p>
                <ul className="space-y-2 text-sm text-white/80">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="transition hover:text-white">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-base font-semibold">뉴스레터</p>
            <div className="flex gap-2 rounded-xl bg-white/10 p-2">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="flex-1 rounded-lg border-none bg-transparent text-sm placeholder:text-white/60 focus:outline-none"
              />
              <Button size="sm" className="px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 px-6 py-5 text-center text-sm text-white/80 lg:px-10">
        Build-Up © 2025. All rights reserved.
      </div>
    </footer>
  );
}
