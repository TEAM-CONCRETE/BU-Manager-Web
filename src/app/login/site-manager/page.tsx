import { Suspense } from "react";

import { LoginForm } from "@/components/features/auth/login-form";
import { loginConfigs } from "@/components/features/auth/login-config";
import { LoginShell } from "@/components/features/auth/login-shell";

export const dynamic = "force-dynamic";

export default function SiteManagerLoginPage() {
  const config = loginConfigs.siteManager;

  return (
    <LoginShell brand={config.brand}>
      <Suspense fallback={null}>
        <LoginForm {...config.form} />
      </Suspense>
    </LoginShell>
  );
}
