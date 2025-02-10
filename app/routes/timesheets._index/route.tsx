import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewDay, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import { getDB } from "~/db/getDB";
import { FormInput } from "~/components/form/FormInput";
import { NavLink } from "~/components/navigation/NavLink";
import { Button } from "~/components/form/Button";
import { Table } from "~/components/table/Table";
import { Pagination } from "~/components/navigation/Pagination";
import { PageLayout } from "~/components/layout/PageLayout";
import { ContentHeader } from "~/components/layout/ContentHeader";
import { ViewToggle } from "~/components/controls/ViewToggle";
import { FilterDropdown } from "~/components/controls/FilterDropdown";
import { DataTable } from "~/components/table/DataTable";

const ITEMS_PER_PAGE = 10;

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const sortBy = url.searchParams.get("sortBy") || "timesheets.id";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";
  const employeeId = url.searchParams.get("employee_id") || "";

  const db = await getDB();

  let query = `
    SELECT 
      timesheets.id AS id,
      timesheets.employee_id,
      timesheets.start_time,
      timesheets.end_time,
      employees.full_name,
      employees.id AS employee_id
    FROM timesheets 
    JOIN employees ON timesheets.employee_id = employees.id
    WHERE 1=1
  `;
  
  const params: any[] = [];

  if (search) {
    query += " AND employees.full_name LIKE ?";
    params.push(`%${search}%`);
  }

  if (employeeId) {
    query += " AND employees.id = ?";
    params.push(employeeId);
  }

  const countResult = await db.get(
    `SELECT COUNT(*) as count FROM (${query})`,
    params
  );
  const total = countResult.count;

  const qualifiedSortBy = sortBy === 'id' ? 'timesheets.id' : 
                         sortBy === 'employee_id' ? 'timesheets.employee_id' : 
                         sortBy;

  query += ` ORDER BY ${qualifiedSortBy} COLLATE NOCASE ${sortOrder.toUpperCase()}`;
  query += ` LIMIT ? OFFSET ?`;
  params.push(ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE);

  const timesheets = await db.all(query, params);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Get all employees for the filter dropdown
  const employees = await db.all("SELECT id, full_name FROM employees ORDER BY full_name");

  return {
    timesheets: timesheets.map(timesheet => ({
      ...timesheet,
      start_time: new Date(timesheet.start_time).toISOString(),
      end_time: new Date(timesheet.end_time).toISOString(),
    })),
    employees,
    total,
    page,
    totalPages,
    sortBy,
    sortOrder,
  };
}

export default function TimesheetsPage() {
  const { timesheets, employees, page, totalPages, sortBy, sortOrder } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();

  // Initialize Schedule-X calendar
  const eventsService = useState(() => createEventsServicePlugin())[0];
  
  // Format dates to YYYY-MM-DD HH:mm format that Schedule-X expects
  const formatDateForCalendar = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' '); // Format: "YYYY-MM-DD HH:mm"
  };

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: timesheets.map((timesheet: any) => ({
      id: timesheet.id.toString(),
      title: timesheet.full_name,
      start: formatDateForCalendar(timesheet.start_time),
      end: formatDateForCalendar(timesheet.end_time),
      extendedProps: {
        notes: timesheet.notes
      }
    })),
    plugins: [eventsService],
    defaultView: 'week',
    translations: {
      navigation: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      }
    }
  });

  useEffect(() => {
    eventsService.getAll();
  }, []);

  const columns = [
    { key: "id", label: "ID", width: "w-[80px]" },
    { key: "full_name", label: "Employee", width: "w-[200px]" },
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
    { key: "notes", label: "Notes", width: "w-[300px]" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set("search", searchTerm);
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSort = (column: string) => {
    setSearchParams(prev => {
      const currentSortBy = prev.get("sortBy");
      const currentOrder = prev.get("sortOrder");

      prev.set("page", "1");

      if (currentSortBy === column) {
        prev.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
      } else {
        prev.set("sortBy", column);
        prev.set("sortOrder", "asc");
      }

      return prev;
    });
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  const handleRowClick = (timesheetId: number) => {
    navigate(`/timesheets/${timesheetId}`);
  };

  // Group timesheets by date for calendar view
  const groupedTimesheets = timesheets.reduce((acc: any, timesheet: any) => {
    const date = new Date(timesheet.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(timesheet);
    return acc;
  }, {});

  // Add employee filter handler
  const handleEmployeeFilter = (employeeId: string) => {
    setSearchParams(prev => {
      if (employeeId) {
        prev.set("employee_id", employeeId);
      } else {
        prev.delete("employee_id");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  return (
    <PageLayout 
      title="Timesheets" 
      addButtonLink="/timesheets/new" 
      addButtonText="Add Timesheet"
    >
      <ContentHeader
        title="Timesheets"
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        onSearch={handleSearch}
        viewControls={
          <ViewToggle 
            isTableView={isTableView} 
            onToggle={setIsTableView} 
          />
        }
        filterControls={
          <FilterDropdown
            value={searchParams.get("employee_id") || ""}
            onChange={handleEmployeeFilter}
            options={employees.map((e: { id: string; full_name: string }) => ({ 
              id: e.id, 
              label: e.full_name 
            }))}
            placeholder="All Employees"
          />
        }
      />

      {isTableView ? (
        <>
          <DataTable
            columns={columns}
            data={timesheets}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            buildPageUrl={buildPageUrl}
          />
        </>
      ) : (
        <div className="sx-react-calendar-wrapper h-[800px] max-h-[90vh] w-full">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
    </PageLayout>
  );
}