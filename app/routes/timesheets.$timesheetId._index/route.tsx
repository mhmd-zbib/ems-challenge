import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { NavLink } from "~/components/NavLink";

interface TimesheetDetails {
  id: number;
  employee_id: number;
  employee_name: string;
  start_time: string;
  end_time: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export async function loader({ params }: any) {
  const db = await getDB();
  
  const timesheet = await db.get<TimesheetDetails>(`
    SELECT 
      t.*,
      e.full_name as employee_name
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.id = ?
  `, params.timesheetId);

  if (!timesheet) {
    throw new Error("Timesheet not found");
  }

  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData<{ timesheet: TimesheetDetails }>();

  const duration = new Date(timesheet.end_time).getTime() - 
                  new Date(timesheet.start_time).getTime();
  const hours = Math.round(duration / (1000 * 60 * 60) * 10) / 10;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Timesheet Details</h1>
        <div className="flex space-x-4">
          <NavLink href="/timesheets">
            Timesheets
          </NavLink>
          <NavLink href="/employees">
            Employees
          </NavLink>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {timesheet.employee_name}
            </h2>
            <p className="text-gray-600">
              Duration: {hours} hours
            </p>
          </div>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(timesheet.start_time).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">End Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(timesheet.end_time).toLocaleString()}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Work Summary</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {timesheet.summary || 'No summary provided'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
