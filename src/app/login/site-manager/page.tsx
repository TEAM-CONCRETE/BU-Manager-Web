"use client";

import { LoginForm } from "@/components/features/auth/login-form";
import { loginConfigs } from "@/components/features/auth/login-config";
import { LoginShell } from "@/components/features/auth/login-shell";

export default function SiteManagerLoginPage() {
  const config = loginConfigs.siteManager;

  return (
    <LoginShell brand={config.brand}>
      <LoginForm {...config.form} />
    </LoginShell>
  );
}
