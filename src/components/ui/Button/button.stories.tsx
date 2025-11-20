"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PlusOutlined } from "@ant-design/icons";

import { Button, type ButtonProps } from "@/components/ui/Button/button";

const meta: Meta<ButtonProps> = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Company/SiteManager 섹션에서 사용하는 CTA 버튼. Tailwind @theme 토큰과 Ant Design 테마를 공유합니다.",
      },
    },
  },
  argTypes: {
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
  args: {
    children: "CTA 버튼",
    variant: "primary",
    size: "md",
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Soft: Story = {
  args: {
    variant: "soft",
    children: "Soft Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const WithIcon: Story = {
  args: {
    children: "새 현장 추가",
    leftIcon: <PlusOutlined />,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
    disabled: true,
  },
};

export const Block: Story = {
  args: {
    children: "Full Width",
    fullWidth: true,
  },
  decorators: [
    (StoryFn) => (
      <div className="w-full max-w-sm">
        <StoryFn />
      </div>
    ),
  ],
};
