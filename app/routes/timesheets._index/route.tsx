import { useLoaderData } from "react-router";
import '@schedule-x/theme-default/dist/index.css';
import { PageLayout } from "~/components/PageLayout";
import { timesheetService } from "~/services/timesheetService";
import { TimesheetList } from "~/components/timesheets/TimesheetList";
import { TimesheetCalendarView } from "~/components/timesheets/TimesheetCalendarView";
import { TimesheetHeader } from "~/components/timesheets/TimesheetHeader";
import { useListManagement } from "~/hooks/useListManagement";
import { useState } from "react";
import type { Timesheet } from "~/types/timesheet";
import type { Employee } from "~/types/employee";

interface LoaderData {
  timesheets: Timesheet[];
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const sortBy = url.searchParams.get("sortBy") || "timesheets.id";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";
  const employeeId = url.searchParams.get("employee_id") || "";

  const [timesheetsResult, employees] = await Promise.all([
    timesheetService.fetchTimesheets({
      page,
      search,
      sortBy,
      sortOrder,
      employeeId,
      itemsPerPage: 10
    }),
    timesheetService.fetchEmployees()
  ]);

  return {
    ...timesheetsResult,
    employees,
    page,
    sortBy,
    sortOrder,
  };
}

export default function TimesheetsPage() {
  const { timesheets, employees, page, totalPages, sortBy, sortOrder } = useLoaderData<LoaderData>();
  const [isTableView, setIsTableView] = useState(true);
  
  const {
    searchParams,
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleSort,
    buildPageUrl,
    handleFilter
  } = useListManagement({
    defaultSortBy: "timesheets.id"
  });

  return (
    <PageLayout
      title="Timesheets"
      addButtonLink="/timesheets/new"
      addButtonText="Add Timesheet"
      currentPath="/timesheets"
    >
      <TimesheetHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        isTableView={isTableView}
        onViewToggle={setIsTableView}
        employeeId={searchParams.get("employee_id") || ""}
        onEmployeeFilter={(id) => handleFilter("employee_id", id)}
        employees={employees}
      />

      {isTableView ? (
        <TimesheetList
          timesheets={timesheets}
          page={page}
          totalPages={totalPages}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          buildPageUrl={buildPageUrl}
        />
      ) : (
        <TimesheetCalendarView timesheets={timesheets} />
      )}
    </PageLayout>
  );
}