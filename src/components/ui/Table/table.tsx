"use client";

import { Table as AntTable, type TableProps as AntTableProps } from "antd";
import { type CSSProperties, ReactNode, type TdHTMLAttributes, type ThHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type TableComponentProps<RecordType> = AntTableProps<RecordType>["components"];

export interface TableProps<RecordType extends Record<string, unknown>>
  extends AntTableProps<RecordType> {
  zebra?: boolean;
  density?: "comfortable" | "compact";
  headerExtra?: ReactNode;
  className?: string;
  showHeaderBar?: boolean;
  borderedContainer?: boolean;
  headerCellClassName?: string;
  headerCellStyle?: CSSProperties;
  headerCellStyles?: CSSProperties[];
}

export function Table<RecordType extends Record<string, unknown> = Record<string, unknown>>({
  zebra = true,
  density = "comfortable",
  headerExtra,
  className,
  rowClassName,
  showHeaderBar = true,
  borderedContainer = true,
  headerCellClassName,
  headerCellStyle,
  headerCellStyles,
  ...props
}: TableProps<RecordType>) {
  const components: TableComponentProps<RecordType> = {
    header: {
      cell: (
        cellProps: ThHTMLAttributes<HTMLTableCellElement> & {
          column?: { key?: string };
          columnIndex?: number;
        },
      ) => {
        const columnIndex =
          typeof cellProps.columnIndex === "number" ? cellProps.columnIndex : undefined;
        const extraStyle =
          typeof columnIndex === "number" && headerCellStyles?.[columnIndex]
            ? headerCellStyles[columnIndex]
            : undefined;

        return (
          <th
            {...cellProps}
            className={cn(
              cellProps.className,
              headerCellClassName ?? "!bg-state-info-weak",
              "text-left !text-text-base text-xs font-semibold uppercase tracking-wide",
              headerCellClassName ? undefined : "ant-table-cell",
            )}
            style={{
              ...cellProps.style,
              ...headerCellStyle,
              ...extraStyle,
            }}
          />
        );
      },
    },
    body: {
      cell: (cellProps: TdHTMLAttributes<HTMLTableCellElement>) => (
        <td
          {...cellProps}
          className={cn(
            cellProps.className,
            "text-left text-sm",
            zebra ? "text-text-base dark:text-white" : "text-[#0b0f1a] dark:text-white",
          )}
          style={cellProps.style}
        />
      ),
    },
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden [&_.ant-table-row:hover>td]:!bg-transparent [&_.ant-table-cell-row-hover]:!bg-transparent",
        borderedContainer ? "rounded-2xl border border-border dark:border-dark-border" : "",
        className,
      )}
    >
      {showHeaderBar && (
        <div className="flex items-center justify-between border-b border-border bg-bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-bg-surface">
          {props.title ? (
            <div className="text-base font-semibold text-text-strong dark:text-dark-text-strong">
              {typeof props.title === "function"
                ? props.title(props.dataSource ?? [])
                : props.title}
            </div>
          ) : (
            <span />
          )}
          {headerExtra}
        </div>
      )}
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
