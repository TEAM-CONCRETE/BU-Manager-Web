import AntdPreview from "@/components/features/antd-preview";

const colors = [
  { name: "Primary", className: "bg-brand-primary text-white" },
  { name: "Secondary", className: "bg-brand-secondary text-white" },
  {
    name: "Surface",
    className: "bg-bg-surface text-text-base border border-border",
  },
  {
    name: "Subtle Surface",
    className: "bg-bg-subtle text-text-base border border-border",
  },
  { name: "Success", className: "bg-state-success text-white" },
  { name: "Warning", className: "bg-state-warning text-white" },
  { name: "Danger", className: "bg-state-danger text-white" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-page px-4 py-10 text-text-base transition-colors duration-300 dark:bg-dark-bg-page dark:text-dark-text-base sm:px-6 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-dashed border-border bg-bg-surface p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.3)] dark:border-dark-border dark:bg-dark-bg-surface">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-text-subtle dark:text-dark-text-base">컬러 토큰 스냅샷</p>
            <h1 className="text-2xl font-semibold text-text-strong dark:text-dark-text-strong">
              Tailwind @theme 적용 상태
            </h1>
          </div>
          <span className="text-xs font-semibold tracking-wide text-text-subtle">
            반응형 · 다크 모드 준비 완료
          </span>
        </header>
        <p className="mt-4 text-sm leading-6 text-text-base dark:text-dark-text-base">
          각 카드가 `@theme inline`으로 정의한 토큰을 Tailwind 유틸리티 클래스로 소비하는
          예시입니다.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.name}
              className={`flex h-32 flex-col justify-between rounded-2xl p-4 text-sm font-medium ${color.className}`}
            >
              <span>{color.name}</span>
              <span className="text-xs opacity-80">
                token: {color.className.split(" ")[0].replace("bg-", "")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <AntdPreview />
        </div>
      </section>
    </div>
  );
}
