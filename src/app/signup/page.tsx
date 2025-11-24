"use client";

import { SiteManagerSignupForm } from "@/components/features/auth/signup-form";
import { LoginShell } from "@/components/features/auth/login-shell";

const brandContent = {
  badge: "SITE MANAGER",
  title: "",
  description: "",
  tone: "primary" as const,
  image: {
    src: "/architecture.jpg",
    alt: "Signup background image",
  },
};

export default function SiteManagerSignupPage() {
  return (
    <LoginShell brand={brandContent} imagePosition="right">
      <SiteManagerSignupForm />
    </LoginShell>
  );
}
