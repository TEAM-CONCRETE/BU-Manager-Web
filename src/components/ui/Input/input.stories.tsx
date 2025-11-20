"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchOutlined } from "@ant-design/icons";

import { Input, type InputProps } from "@/components/ui/input/input";

const meta: Meta<InputProps> = {
  title: "Components/UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "현장명",
    placeholder: "예) 이천 A 아파트 현장",
    description: "시설명이나 프로젝트 명칭을 입력하세요",
  },
};

export default meta;

type Story = StoryObj<InputProps>;

export const Default: Story = {};

export const WithPrefix: Story = {
  args: {
    prefix: <SearchOutlined />,
    placeholder: "검색어 입력",
  },
};

export const Error: Story = {
  args: {
    label: "담당자 이메일",
    placeholder: "name@company.com",
    error: "유효한 이메일 주소를 입력해 주세요",
  },
};

export const Disabled: Story = {
  args: {
    label: "프로젝트 코드",
    value: "BUP-2024-1105",
    disabled: true,
  },
};

export const Compact: Story = {
  args: {
    size: "sm",
    label: "직원 수",
    placeholder: "0",
    suffix: "명",
  },
};
