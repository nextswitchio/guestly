import React from "react";

interface Column<T extends Record<string, unknown>> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T extends Record<string, unknown>>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-100">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-3 py-2 text-left font-medium text-neutral-700">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-neutral-200">
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td key={String(col.key)} className="px-3 py-2 text-neutral-800">
                    {col.render ? col.render(value, row) : String(value as unknown)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
