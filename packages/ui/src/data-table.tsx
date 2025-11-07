import React from 'react';

export interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
  }>;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({ data, columns, loading }: DataTableProps<T>) {
  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left p-4 text-sm font-medium text-gray-400">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900">
              {columns.map((col) => (
                <td key={String(col.key)} className="p-4 text-sm text-gray-300">
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

