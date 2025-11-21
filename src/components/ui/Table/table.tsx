"use client";

import { Table as AntTable, type TableProps as AntTableProps } from "antd";
import { ReactNode, type TdHTMLAttributes, type ThHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type TableComponentProps<RecordType> = AntTableProps<RecordType>["components"];

export interface TableProps<RecordType extends Record<string, unknown>>
  extends AntTableProps<RecordType> {
  zebra?: boolean;
  density?: "comfortable" | "compact";
  headerExtra?: ReactNode;
  className?: string;
}

export function Table<RecordType extends Record<string, unknown> = Record<string, unknown>>({
  zebra = true,
  density = "comfortable",
  headerExtra,
  className,
  rowClassName,
  ...props
}: TableProps<RecordType>) {
  const components: TableComponentProps<RecordType> = {
    header: {
      cell: (cellProps: ThHTMLAttributes<HTMLTableCellElement>) => (
        <th
          {...cellProps}
          className={cn(
            cellProps.className,
            "bg-bg-subtle text-left text-text-subtle text-xs font-semibold uppercase tracking-wide dark:bg-dark-bg-surface dark:text-dark-text-strong",
          )}
        />
      ),
    },
    body: {
      cell: (cellProps: TdHTMLAttributes<HTMLTableCellElement>) => (
        <td
          {...cellProps}
          className={cn(
            cellProps.className,
            "text-left text-sm dark:text-[var(--color-dark-text-strong)]",
          )}
          style={{
            color: zebra ? "var(--color-text-strong)" : "#0b0f1a",
          }}
        />
      ),
    },
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border dark:border-dark-border",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-bg-surface">
        {props.title ? (
          <div className="text-base font-semibold text-text-strong dark:text-dark-text-strong">
            {typeof props.title === "function" ? props.title(props.dataSource ?? []) : props.title}
          </div>
        ) : (
          <span />
        )}
        {headerExtra}
      </div>
      <AntTable<RecordType>
        pagination={props.pagination ?? false}
        components={components}
        scroll={props.scroll ?? { x: "max-content" }}
        rowClassName={(record, index, indent) =>
          cn(
            typeof rowClassName === "function"
              ? rowClassName(record, index, indent ?? 0)
              : rowClassName,
            density === "compact" ? "h-12" : "h-14",
            zebra && index % 2 === 1 ? "bg-bg-subtle/60 dark:bg-dark-bg-surface/40" : "",
          )
        }
        {...props}
      />
    </div>
  );
}
