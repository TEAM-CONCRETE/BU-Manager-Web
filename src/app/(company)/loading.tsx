export default function CompanyLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page dark:bg-dark-bg-page">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-brand-primary dark:border-dark-border dark:border-t-brand-primary" />
        <p className="text-sm text-text-subtle dark:text-dark-text-base">로딩 중...</p>
      </div>
    </div>
  );
}
