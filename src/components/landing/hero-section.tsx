"use client";

import Image from "next/image";

type HeroSectionProps = {
  scrollY: number;
};

export function HeroSection({ scrollY }: HeroSectionProps) {
  const heroBgOffset = Math.min(scrollY * 0.05, 160);
  const statsOffset = Math.min(scrollY * 0.03, 60);
  const deviceOffset = -Math.min(scrollY * 0.08, 140);

  return (
    <section
      className="relative flex min-h-screen w-full snap-start items-center overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,#f9fafb,#eff6ff)] pb-16 pt-24 dark:border-dark-border dark:bg-dark-bg-surface lg:pt-32"
      style={{ backgroundPosition: `center ${heroBgOffset}px` }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-primary/15 blur-3xl sm:h-72 sm:w-72"
          style={{ transform: `translate3d(0, ${-heroBgOffset * 0.6}px, 0)` }}
        />
        <div
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-secondary/20 blur-[90px]"
          style={{ transform: `translate3d(0, ${heroBgOffset * 0.4}px, 0)` }}
        />
      </div>
      <div className="relative grid w-full gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:px-10">
        <div className="flex min-h-[60vh] flex-col justify-center gap-6">
          <p className="text-sm font-semibold tracking-[0.3em] text-brand-primary">
            BUILD-UP PLATFORM
          </p>
          <h1 className="!mb-0 text-[48px] !font-semibold tracking-tight text-text-strong dark:text-[#0d1118]">
            현장의 모든 순간을 Build-Up에 담다
          </h1>
          <p className="text-lg leading-relaxed text-text-base/90 dark:text-[#0d1118]">
            건설현장의 근로계약 – 근태 – 급여 – 안전을 플랫폼 AI 기반으로 자동화하여 <br />{" "}
            체계적이고 투명한 노무 관리 환경을 구축합니다.
          </p>
          <div
            className="flex flex-wrap gap-6 text-sm text-text-subtle dark:text-dark-text-base"
            style={{ transform: `translate3d(0, ${statsOffset}px, 0)` }}
          >
            <Stat label="활성 사용자" value="4,500+" />
            <Stat label="업무 자동화율" value="98%" />
            <Stat label="실시간 모니터링" value="24/7" />
          </div>
        </div>
        <DevicePreview offset={deviceOffset} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-4xl font-bold text-brand-primary">{value}</p>
      <p className="text-xs uppercase tracking-widest dark:text-[#0d1118]">{label}</p>
    </div>
  );
}

function DevicePreview({ offset }: { offset: number }) {
  return (
    <div
      className="relative flex items-center justify-end transition-transform duration-300"
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <div
        className="absolute inset-0 translate-y-6 rounded-[40px] bg-brand-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="relative w-full max-w-[640px]">
        <div className="rounded-[36px] border border-border bg-white p-4 shadow-2xl dark:border-dark-border dark:bg-dark-bg-surface/70">
          <Image
            src="/landing_desktop.png"
            alt="Build-Up desktop preview"
            width={745}
            height={521}
            priority
            className="h-auto w-full rounded-[28px] border border-border/40 object-cover dark:border-dark-border/60"
          />
        </div>
        <div className="absolute -left-10 bottom-0 w-[210px] sm:-left-16 sm:w-[230px]">
          <div
            className="rounded-[32px] border border-border bg-white p-2 shadow-xl transition-transform duration-300 dark:border-dark-border dark:bg-dark-bg-surface/80"
            style={{ transform: `translate3d(0, ${offset * 0.4}px, 0)` }}
          >
            <Image
              src="/landing_mobile.png"
              alt="Build-Up mobile preview"
              width={219}
              height={459}
              className="h-auto w-full rounded-[26px] border border-border/40 object-cover dark:border-dark-border/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
