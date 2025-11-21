"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
  SafetyOutlined,
  WarningOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { SidebarNavigation, type SidebarNavigationProps } from "./sidebar-navigation";
import { SidebarLayout } from "./sidebar-layout";

const meta: Meta<SidebarNavigationProps> = {
  title: "Components/Common/SidebarNavigation",
  component: SidebarNavigation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Company 섹션과 SiteManager 섹션에서 공통으로 사용하는 사이드바. Tailwind v4 디자인 토큰과 Collapsible 인터랙션을 지원합니다.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen">
        <Story />
        <main className="flex-1 bg-bg-page p-8 dark:bg-dark-bg-page">
          <h1 className="text-2xl font-bold text-text-strong dark:text-dark-text-strong">
            메인 콘텐츠 영역
          </h1>
        </main>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<SidebarNavigationProps>;

const siteMenuItems = [
  {
    id: "site-1",
    label: "이천 필그린 아파트",
    icon: <HomeOutlined />,
    active: true,
    href: "/sites/1",
  },
  {
    id: "site-2",
    label: "용인 리가 아파트",
    icon: <HomeOutlined />,
    href: "/sites/2",
  },
  {
    id: "site-3",
    label: "강남 아스하임 오피스텔",
    icon: <HomeOutlined />,
    href: "/sites/3",
  },
];

const featureMenuItems = [
  {
    id: "attendance",
    label: "근태 관리",
    icon: <FileTextOutlined />,
    active: true,
    href: "/attendance",
  },
  {
    id: "contract",
    label: "근로계약서 관리",
    icon: <FileTextOutlined />,
    href: "/contract",
  },
  {
    id: "workers",
    label: "근로자 관리",
    icon: <UserOutlined />,
    href: "/workers",
  },
  {
    id: "daily-report",
    label: "작업일보 작성",
    icon: <EditOutlined />,
    href: "/daily-report",
  },
  {
    id: "safety",
    label: "안전교육일지 작성",
    icon: <SafetyOutlined />,
    href: "/safety",
  },
  {
    id: "danger-zone",
    label: "위험구역 접근 알림",
    icon: <WarningOutlined />,
    href: "/danger-zone",
  },
];

const defaultBottomAction = {
  label: "현장 추가",
  icon: <PlusOutlined />,
  onClick: () => {},
};

export const CompanyWithSites: Story = {
  name: "Company · 현장 목록",
  args: {
    menuItems: siteMenuItems,
    bottomAction: defaultBottomAction,
  },
};

export const SiteManagerWithFeatures: Story = {
  name: "SiteManager · 기능 메뉴",
  args: {
    menuItems: featureMenuItems,
    bottomAction: defaultBottomAction,
  },
};

export const WithSearch: Story = {
  name: "검색 입력 포함",
  args: {
    menuItems: siteMenuItems,
    bottomAction: defaultBottomAction,
  },
};

export const Collapsed: Story = {
  name: "Collapsed (Desktop)",
  args: {
    menuItems: siteMenuItems,
    collapsed: true,
    bottomAction: defaultBottomAction,
  },
};

export const WithoutBottomAction: Story = {
  name: "CTA 없이 사용",
  args: {
    menuItems: featureMenuItems,
  },
};

export const LayoutWithContent: Story = {
  name: "Layout 연동 예시",
  render: (args) => (
    <SidebarLayout {...args}>
      <div className="space-y-4 p-8">
        <h2 className="text-2xl font-bold text-text-strong dark:text-dark-text-strong">
          메인 콘텐츠 영역
        </h2>
        <p className="text-text-base dark:text-dark-text-base">
          `SidebarLayout`을 사용하면 사이드바 접힘 상태에 맞춰 본문 폭이 자연스럽게 반응합니다.
        </p>
      </div>
    </SidebarLayout>
  ),
  args: {
    menuItems: featureMenuItems,
    bottomAction: defaultBottomAction,
  },
};
