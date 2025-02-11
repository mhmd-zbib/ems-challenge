import { useLoaderData, redirect, useActionData } from "react-router";
import { timesheetService } from "~/services/timesheetService";
import { NavLink } from "~/components/common/NavLink";
import { NewTimesheetForm } from "~/components/timesheets/NewTimesheetForm";
import type { Employee } from "~/types/employee";
import type { ValidationErrors } from "~/types/timesheet";

interface LoaderData {
  employees: Employee[];
}

export async function loader() {
  const employees = await timesheetService.fetchEmployees();
  return { employees };
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const employeeId = formData.get("employee_id") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const summary = formData.get("notes") as string;

  const errors: ValidationErrors = {};

  if (!employeeId) errors.employeeId = "Employee is required";
  if (!startTime) errors.startTime = "Start time is required";
  if (!endTime) errors.endTime = "End time is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const validationErrors = await timesheetService.validateTimesheet({
      employeeId,
      startTime,
      endTime,
      summary
    });

    if (Object.keys(validationErrors).length > 0) {
      return { errors: validationErrors };
    }

    await timesheetService.createTimesheet({
      employeeId,
      startTime,
      endTime,
      summary
    });

    return redirect("/timesheets");
  } catch (error: any) {
    return {
      errors: {
        general: `Error creating timesheet: ${error.message}`
      }
    };
  }
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData<LoaderData>();
  const actionData = useActionData<{ errors?: ValidationErrors }>();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav className="bg-white shadow-sm mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex">
              <div className="flex space-x-8">
                <NavLink href="/employees">Employees</NavLink>
                <NavLink href="/timesheets">Timesheets</NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">New Timesheet</h1>
        </div>

        {actionData?.errors?.general && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {actionData.errors.general}
          </div>
        )}

        <NewTimesheetForm 
          employees={employees}
          serverErrors={actionData?.errors}
        />
      </div>
    </div>
  );
}
