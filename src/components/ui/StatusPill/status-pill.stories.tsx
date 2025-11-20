"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { StatusPill, type StatusPillProps } from "@/components/ui/status-pill/status-pill";

const meta: Meta<StatusPillProps> = {
  title: "Components/UI/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  args: {
    children: "지급",
  },
};

export default meta;

type Story = StoryObj<StatusPillProps>;

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "미지급",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "지각",
  },
};

export const InfoWithIcon: Story = {
  args: {
    variant: "info",
    children: "근무 중",
    icon: <CheckOutlined />,
    dot: false,
  },
};

export const NeutralCompact: Story = {
  args: {
    variant: "neutral",
    children: "대기",
    size: "sm",
  },
};

export const DangerWithIcon: Story = {
  args: {
    variant: "danger",
    children: "경고",
    icon: <CloseCircleOutlined />,
    dot: false,
  },
};
