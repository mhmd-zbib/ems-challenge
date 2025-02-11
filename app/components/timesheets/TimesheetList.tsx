import { useNavigate } from "react-router";
import { DataTable } from "~/components/common/DataTable";
import { Pagination } from "~/components/common/Pagination";
import type { Timesheet } from "~/types/timesheet";

interface TimesheetListProps {
  timesheets: Timesheet[];
  page: number;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
  buildPageUrl: (page: number) => string;
}

export function TimesheetList({
  timesheets,
  page,
  totalPages,
  sortBy,
  sortOrder,
  onSort,
  buildPageUrl
}: TimesheetListProps) {
  const navigate = useNavigate();

  const columns = [
    {key: "id", label: "ID", width: "w-[80px]"},
    {key: "full_name", label: "Employee", width: "w-[200px]"},
    {
      key: "start_time",
      label: "Start Time",
      width: "w-[200px]",
      format: (value: string) => new Date(value).toLocaleTimeString()
    },
    {
      key: "end_time",
      label: "End Time",
      width: "w-[200px]",
      format: (value: string) => new Date(value).toLocaleTimeString()
    },
  ];

  const handleRowClick = (timesheetId: number) => {
    navigate(`/timesheets/${timesheetId}`);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={timesheets}
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
    </>
  );
} 