"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ReactNode, useEffect, useMemo, useState } from "react";

import { AuthInitializer } from "@/components/auth/auth-initializer";

type Props = {
  children: ReactNode;
};

const resolveIsDark = () => {
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return true;
    }
  }
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

export default function AppProviders({ children }: Props) {
  const [isDark, setIsDark] = useState(() => resolveIsDark());
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => setIsDark(resolveIsDark());
    const observer = new MutationObserver(handleMediaChange);

    media.addEventListener("change", handleMediaChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      media.removeEventListener("change", handleMediaChange);
      observer.disconnect();
    };
  }, []);

  const baseTokens = {
    colorPrimary: "var(--color-brand-primary)",
    colorInfo: "var(--color-state-info)",
    colorSuccess: "var(--color-state-success)",
    colorWarning: "var(--color-state-warning)",
    colorError: "var(--color-state-danger)",
    fontFamily: "var(--font-geist-sans)",
    borderRadius: 12,
  };

  const lightTokens = {
    colorBgBase: "var(--color-bg-page)",
    colorBgContainer: "var(--color-bg-surface)",
    colorBorder: "var(--color-border)",
    colorBorderSecondary: "var(--color-border-strong)",
    colorText: "var(--color-text-base)",
    colorTextBase: "var(--color-text-base)",
    colorTextHeading: "var(--color-text-strong)",
    colorTextSecondary: "var(--color-text-subtle)",
    colorFillSecondary: "var(--color-bg-subtle)",
  };

  const darkTokens = {
    colorBgBase: "var(--color-dark-bg-page)",
    colorBgContainer: "var(--color-dark-bg-surface)",
    colorBorder: "var(--color-dark-border)",
    colorBorderSecondary: "var(--color-dark-border)",
    colorText: "var(--color-dark-text-base)",
    colorTextBase: "var(--color-dark-text-base)",
    colorTextHeading: "var(--color-dark-text-strong)",
    colorTextSecondary: "var(--color-dark-text-base)",
    colorFillSecondary: "var(--color-dark-bg-surface)",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            ...baseTokens,
            ...(isDark ? darkTokens : lightTokens),
          },
        }}
      >
        {children}
        <AuthInitializer />
      </ConfigProvider>
    </QueryClientProvider>
  );
}
