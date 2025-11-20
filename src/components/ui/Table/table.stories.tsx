"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import { Table } from "@/components/ui/Table/table";

interface Row extends Record<string, unknown> {
  key: string;
  project: string;
  manager: string;
  amount: string;
  status: "success" | "warning" | "danger" | "info" | "neutral";
}

const columns = [
  {
    title: "프로젝트",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "담당자",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "금액",
    dataIndex: "amount",
    key: "amount",
    align: "right" as const,
  },
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (value: Row["status"]) => (
      <StatusPill variant={value}>
        {value === "success"
          ? "지급"
          : value === "warning"
            ? "대기"
            : value === "danger"
              ? "지연"
              : "진행 중"}
      </StatusPill>
    ),
  },
];

const data: Row[] = [
  { key: "1", project: "이천 A 현장", manager: "박승희", amount: "₩15,200,000", status: "success" },
  {
    key: "2",
    project: "용인 리가 아파트",
    manager: "문현민",
    amount: "₩8,750,000",
    status: "warning",
  },
  { key: "3", project: "강남 오피스텔", manager: "김세원", amount: "₩21,300,000", status: "info" },
  { key: "4", project: "현장 B", manager: "최윤호", amount: "₩5,900,000", status: "danger" },
];

const meta: Meta<typeof Table<Row>> = {
  title: "Components/UI/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    columns,
    dataSource: data,
  },
};

export default meta;

type Story = StoryObj<typeof Table<Row>>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    density: "compact",
  },
};

export const WithoutZebra: Story = {
  args: {
    zebra: false,
  },
};
