import { useNavigate } from "react-router";
import { DataTable } from "~/components/DataTable";
import { Pagination } from "~/components/Pagination";
import type { Employee } from "~/types/employee";
import { employeeColumns } from "~/constants/employeeColumns";

interface EmployeeListProps {
  employees: Employee[];
  page: number;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
  buildPageUrl: (page: number) => string;
}

export function EmployeeList({
  employees,
  page,
  totalPages,
  sortBy,
  sortOrder,
  onSort,
  buildPageUrl
}: EmployeeListProps) {
  const navigate = useNavigate();
  
  const handleRowClick = (employeeId: number) => {
    navigate(`/employees/${employeeId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <DataTable
        columns={employeeColumns}
        data={employees}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onRowClick={handleRowClick}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
      />
    </div>
  );
} 