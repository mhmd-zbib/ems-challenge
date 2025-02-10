import { useLoaderData, Form, redirect, useActionData } from "react-router";
import { Button } from "~/components/form/Button";
import { FormInput } from "~/components/form/FormInput";
import { getDB } from "~/db/getDB";
import { NavLink } from "~/components/navigation/NavLink";
import { useState, useEffect } from "react";

interface Employee {
  id: number;
  full_name: string;
}

interface ValidationErrors {
  employeeId?: string;
  startTime?: string;
  endTime?: string;
  general?: string;
}

export async function loader() {
  const db = await getDB();
  const employees = await db.all<Employee[]>("SELECT id, full_name FROM employees ORDER BY full_name");
  return { employees };
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const employeeId = formData.get("employee_id");
  const startTime = formData.get("start_time");
  const endTime = formData.get("end_time");
  const notes = formData.get("notes");

  const errors: ValidationErrors = {};

  // Server-side validation
  if (!employeeId) {
    errors.employeeId = "Employee is required";
  }

  if (!startTime) {
    errors.startTime = "Start time is required";
  }

  if (!endTime) {
    errors.endTime = "End time is required";
  }

  if (startTime && endTime) {
    const startDate = new Date(startTime as string);
    const endDate = new Date(endTime as string);
    const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours <= 0) {
      errors.endTime = "End time must be after start time";
    }
    
    if (diffInHours > 24) {
      errors.endTime = "Timesheet duration cannot exceed 24 hours";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const db = await getDB();
    
    // Check if employee exists
    const employee = await db.get("SELECT id FROM employees WHERE id = ?", employeeId);
    if (!employee) {
      return {
        errors: {
          employeeId: "Selected employee does not exist"
        }
      };
    }

    // Check for overlapping timesheets
    const overlapping = await db.get(
      `SELECT id FROM timesheets 
       WHERE employee_id = ? 
       AND (
         (start_time <= ? AND end_time >= ?) OR
         (start_time <= ? AND end_time >= ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [employeeId, startTime, startTime, endTime, endTime, startTime, endTime]
    );

    if (overlapping) {
      return {
        errors: {
          general: "This timesheet overlaps with an existing timesheet for this employee"
        }
      };
    }

    await db.run(
      `INSERT INTO timesheets (employee_id, start_time, end_time, notes) 
       VALUES (?, ?, ?, ?)`,
      [employeeId, startTime, endTime, notes]
    );

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
  const { employees } = useLoaderData<{ employees: Employee[] }>();
  const actionData = useActionData<{ errors?: ValidationErrors }>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [notes, setNotes] = useState("");

  // Client-side validation
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours <= 0) {
        errors.endTime = "End time must be after start time";
      }
      
      if (diffInHours > 24) {
        errors.endTime = "Timesheet duration cannot exceed 24 hours";
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [startTime, endTime]);

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

        <Form method="post" className="p-6 space-y-6">
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              id="employee_id"
              name="employee_id"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                actionData?.errors?.employeeId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
            {actionData?.errors?.employeeId && (
              <p className="mt-1 text-sm text-red-600">{actionData.errors.employeeId}</p>
            )}
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <FormInput
              type="datetime-local"
              id="start_time"
              name="start_time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={actionData?.errors?.startTime || clientErrors.startTime ? 'border-red-300' : ''}
            />
            {(actionData?.errors?.startTime || clientErrors.startTime) && (
              <p className="mt-1 text-sm text-red-600">
                {actionData?.errors?.startTime || clientErrors.startTime}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <FormInput
              type="datetime-local"
              id="end_time"
              name="end_time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime}
              className={actionData?.errors?.endTime || clientErrors.endTime ? 'border-red-300' : ''}
            />
            {(actionData?.errors?.endTime || clientErrors.endTime) && (
              <p className="mt-1 text-sm text-red-600">
                {actionData?.errors?.endTime || clientErrors.endTime}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300`}
              placeholder="Add any additional notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={Object.keys(clientErrors).length > 0}>
              Create Timesheet
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
