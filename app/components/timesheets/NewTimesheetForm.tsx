import { Form } from "react-router";
import { Button } from "~/components/common/Button";
import { FormInput } from "~/components/common/FormInput";
import { useTimesheetForm } from "~/hooks/useTimesheetForm";
import type { Employee } from "~/types/employee";
import type { ValidationErrors } from "~/types/timesheet";

interface NewTimesheetFormProps {
  employees: Employee[];
  serverErrors?: ValidationErrors;
}

export function NewTimesheetForm({ employees, serverErrors }: NewTimesheetFormProps) {
  const {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    notes,
    setNotes,
    clientErrors
  } = useTimesheetForm();

  const errors = { ...clientErrors, ...serverErrors };

  return (
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
            errors?.employeeId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.full_name}
            </option>
          ))}
        </select>
        {errors?.employeeId && (
          <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
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
          className={errors?.startTime ? 'border-red-300' : ''}
        />
        {errors?.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
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
          className={errors?.endTime ? 'border-red-300' : ''}
        />
        {errors?.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
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
          className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
  );
} 