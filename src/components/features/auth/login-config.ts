import type { RawRole } from "@/utils/map-role";

export type LoginVariant = "company" | "siteManager";

type BrandConfig = {
  badge?: string;
  title?: string;
  description?: string;
  image: {
    src: string;
    alt: string;
  };
  tone?: "primary" | "secondary";
};

type FormConfig = {
  title: string;
  subtitle: string;
  description?: string;
  primaryButtonLabel: string;
  primaryButtonVariant?: "primary" | "secondary" | "soft" | "ghost" | "subtle";
  accentColorClass?: string;
  allowedRoles: RawRole[];
  roleMismatchMessages?: Partial<Record<RawRole, string>>;
  defaultRedirect: string;
  supportLink: {
    label: string;
    href: string;
  };
  signupLink: {
    label: string;
    href: string;
    external?: boolean;
  };
};

type LoginConfig = {
  brand: BrandConfig;
  form: FormConfig;
};

export const loginConfigs: Record<LoginVariant, LoginConfig> = {
  company: {
    brand: {
      badge: undefined,
      title: "",
      description: "",
      tone: "secondary",
      image: {
        src: "/architecture.jpg",
        alt: "Modern architecture illustration",
      },
    },
    form: {
      title: "기업 로그인",
      subtitle: "기업 전용 대시보드에 접속합니다.",
      primaryButtonLabel: "로그인",
      primaryButtonVariant: "secondary",
      accentColorClass: "text-brand-secondary",
      allowedRoles: ["ROLE_CORPORATION"],
      roleMismatchMessages: {
        ROLE_MANAGER: "현장 관리자 로그인 페이지를 이용해주세요.",
      },
      defaultRedirect: "/company/dashboard",
      supportLink: {
        label: "현장 관리자 로그인",
        href: "/login/site-manager",
      },
      signupLink: {
        label: "기업 계정 신청하기",
        href: "https://forms.gle/eDcTEu46AyoAYmxt5",
        external: true,
      },
    },
  },
  siteManager: {
    brand: {
      badge: undefined,
      title: "",
      description: "",
      tone: "primary",
      image: {
        src: "/architecture.jpg",
        alt: "Construction site illustration",
      },
    },
    form: {
      title: "현장 관리자 로그인",
      subtitle: "현장 대시보드에 접속합니다.",
      primaryButtonLabel: "로그인",
      accentColorClass: "text-brand-primary",
      allowedRoles: ["ROLE_MANAGER"],
      roleMismatchMessages: {
        ROLE_CORPORATION: "기업 로그인 페이지를 이용해주세요.",
      },
      defaultRedirect: "/manager/dashboard",
      supportLink: {
        label: "기업 계정 로그인",
        href: "/login/company",
      },
      signupLink: {
        label: "현장 관리자 회원가입",
        href: "/signup",
      },
    },
  },
};
