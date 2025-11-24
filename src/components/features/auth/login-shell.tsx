"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type LoginShellProps = {
  brand: {
    badge?: string;
    title?: string;
    description?: string;
    highlights?: {
      title: string;
      description: string;
    }[];
    image: {
      src: string;
      alt: string;
    };
    tone?: "primary" | "secondary";
  };
  children: ReactNode;
};

export function LoginShell({ brand, children }: LoginShellProps) {
  const tone = brand.tone ?? "primary";

  const asideBackgroundClass =
    tone === "secondary"
      ? "bg-gradient-to-br from-brand-secondary/10 via-brand-secondary-soft to-white dark:from-brand-secondary/25 dark:via-dark-bg-surface/60 dark:to-dark-bg-page"
      : "bg-gradient-to-br from-brand-primary/5 via-brand-primary-soft to-white dark:from-brand-primary/20 dark:via-dark-bg-surface/60 dark:to-dark-bg-page";

  const overlayGradientClass =
    tone === "secondary"
      ? "bg-gradient-to-br from-brand-secondary/80 via-brand-secondary/70 to-brand-primary/60"
      : "bg-gradient-to-br from-brand-primary/70 via-brand-primary/60 to-brand-secondary/50";

  return (
    <div className="flex min-h-screen w-full bg-white text-text-base dark:bg-dark-bg-page dark:text-dark-text-base">
      <aside
        className={cn(
          "relative hidden w-[45%] overflow-hidden border-r border-border p-12 dark:border-dark-border lg:flex",
          asideBackgroundClass,
        )}
      >
        <div className="relative z-10 flex flex-col gap-4 text-white/80">
          <div className="mt-auto inline-flex flex-col gap-1 text-sm text-white/80">
            <span>도움이 필요하신가요?</span>
            <Link href="/support" className="text-white underline-offset-4 hover:underline">
              고객 지원팀에 문의하기 →
            </Link>
          </div>
        </div>
        <div className="absolute inset-0">
          <Image
            src={brand.image.src}
            alt={brand.image.alt}
            priority
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className={cn("absolute inset-0", overlayGradientClass)} />
        </div>
      </aside>

      <section className="flex w-full items-center justify-center bg-white px-6 py-12 dark:bg-dark-bg-page sm:px-10 lg:w-[55%]">
        <div className="w-full max-w-[460px]">{children}</div>
      </section>
    </div>
  );
}
