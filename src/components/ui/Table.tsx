import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function Table<T extends { _id?: any }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found",
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3.5 text-gray-700 ${col.className || ""}`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
