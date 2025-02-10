interface Column {
  key: string;
  label: string;
  width: string;
  format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  sortBy?: string;
  sortOrder?: string;
  onSort?: (column: string) => void;
  onRowClick?: (id: number) => void;
}

export function DataTable({ 
  columns, 
  data, 
  sortBy, 
  sortOrder, 
  onSort, 
  onRowClick 
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(({ key, label, width }) => (
              <th
                key={key}
                className={`${width} px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${onSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={() => onSort?.(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  {sortBy === key && (
                    <span className="text-blue-500">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick?.(row.id)}
              role="row"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRowClick?.(row.id);
                }
              }}
            >
              {columns.map(({ key, width, format }) => (
                <td key={key} className={`${width} px-6 py-4 whitespace-nowrap text-sm text-gray-500`}>
                  {format ? format(row[key]) : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 