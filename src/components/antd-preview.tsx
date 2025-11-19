"use client";

import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";

type TaskStatus = "done" | "pending" | "alert";

type TaskRow = {
  key: string;
  task: string;
  manager: string;
  status: TaskStatus;
  deadline: string;
};

const statusMeta: Record<
  TaskStatus,
  { label: string; color: "success" | "warning" | "error" }
> = {
  done: { label: "완료", color: "success" },
  pending: { label: "진행중", color: "warning" },
  alert: { label: "지연", color: "error" },
};

const dataSource: TaskRow[] = [
  {
    key: "1",
    task: "전자계약 서명",
    manager: "박승희",
    status: "pending",
    deadline: "오늘",
  },
  {
    key: "2",
    task: "안전 점검 보고",
    manager: "문현민",
    status: "done",
    deadline: "내일",
  },
  {
    key: "3",
    task: "근태 이슈 처리",
    manager: "김세원",
    status: "alert",
    deadline: "D-3",
  },
];

const columns: TableProps<TaskRow>["columns"] = [
  {
    title: "업무",
    dataIndex: "task",
    key: "task",
  },
  {
    title: "담당자",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      const meta = statusMeta[record.status];
      return <Tag color={meta.color}>{meta.label}</Tag>;
    },
  },
  {
    title: "마감",
    dataIndex: "deadline",
    key: "deadline",
  },
];

export default function AntdPreview() {
  return (
    <div className="rounded-2xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-text-subtle dark:text-dark-text-base">
            Ant Design
          </p>
          <h3 className="text-xl font-semibold text-text-strong dark:text-dark-text-strong">
            Table & Actions
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="default" className="border-border dark:border-dark-border">
            요청 내역
          </Button>
          <Button
            type="primary"
            className="shadow-lg shadow-brand-primary/30"
          >
            새 업무 추가
          </Button>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-border dark:border-dark-border">
        <Table<TaskRow>
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
}

