"use client";

import Image from "next/image";

import { featureCards } from "./constants";

type FeaturesSectionProps = {
  scrollY: number;
};

export function FeaturesSection({ scrollY }: FeaturesSectionProps) {
  const featureOffset = Math.max(0, scrollY - 400) * 0.02;

  return (
    <section
      className="flex min-h-screen w-full snap-start items-center border-b border-border bg-white py-16 dark:border-dark-border dark:bg-dark-bg-surface"
      style={{ backgroundPosition: `center ${featureOffset}px` }}
    >
      <div className="flex w-full flex-col items-center gap-4 px-6 text-center lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-primary">
          Build-Up Main Features
        </p>
        <h2 className="text-3xl font-bold text-text-strong dark:text-dark-text-strong">
          건설현장의 원도급부터 현장노동자까지 전 과정을 지원합니다.
        </h2>
        <p className="text-lg text-text-base/80 dark:text-dark-text-base">
          근태, 안전, 급여, 계약을 하나의 플랫폼에서 관리하며 빠르게 실행하세요.
        </p>
        <div className="mt-10 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, index) => {
            const cardOffset = featureOffset * (0.1 + index * 0.05);
            return <FeatureCard key={card.title} card={card} offset={cardOffset} />;
          })}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  card: (typeof featureCards)[number];
  offset: number;
};

function FeatureCard({ card, offset }: FeatureCardProps) {
  return (
    <article
      className="flex flex-col rounded-3xl border border-[#f3f4f6] bg-white/80 p-8 shadow-sm transition-transform duration-300 dark:border-dark-border dark:bg-dark-bg-page/80"
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-soft">
        <Image
          src={card.icon}
          alt={`${card.title} icon`}
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>
      <h3 className="text-2xl font-semibold text-brand-primary">{card.title}</h3>
      <p className="text-sm text-text-subtle">{card.subtitle}</p>
      <p className="mt-4 text-sm leading-6 text-text-base dark:text-dark-text-base">
        {card.description}
      </p>
    </article>
  );
}
