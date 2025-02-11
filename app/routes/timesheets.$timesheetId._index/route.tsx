import { useLoaderData } from "react-router";
import { timesheetService } from "~/services/timesheetService";
import { NavLink } from "~/components/NavLink";
import { TimesheetDetailsHeader } from "~/components/timesheets/TimesheetDetailsHeader";
import { TimesheetDetailsContent } from "~/components/timesheets/TimesheetDetailsContent";
import { useTimesheetDetails } from "~/hooks/useTimesheetDetails";
import type { TimesheetDetails } from "~/types/timesheet";

interface LoaderData {
  timesheet: TimesheetDetails;
}

export async function loader({ params }: { params: { timesheetId: string } }) {
  const timesheet = await timesheetService.fetchTimesheetDetails(params.timesheetId);
  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData<LoaderData>();
  const { duration, formattedStartTime, formattedEndTime } = useTimesheetDetails(timesheet);

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
        <TimesheetDetailsHeader 
          employeeName={timesheet.employee_name}
          duration={duration}
        />
        <TimesheetDetailsContent
          startTime={formattedStartTime}
          endTime={formattedEndTime}
          summary={timesheet.summary}
        />
      </div>
    </div>
  );
}
