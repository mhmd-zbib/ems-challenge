import { FormInput } from "~/components/common/FormInput";
import type { Employee } from "~/types/employee";

interface EmployeeDetailsProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: keyof Employee, value: any) => void;
}

export function EmployeeDetails({
  employee,
  isEditing,
  onChange
}: EmployeeDetailsProps) {
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <FormInput
                  value={employee.email}
                  onChange={(e) => onChange('email', e.target.value)}
                />
              ) : (
                employee.email
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <FormInput
                  value={employee.phone_number || ''}
                  onChange={(e) => onChange('phone_number', e.target.value)}
                />
              ) : (
                employee.phone_number || 'Not provided'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <FormInput
                  type="date"
                  value={employee.date_of_birth}
                  onChange={(e) => onChange('date_of_birth', e.target.value)}
                />
              ) : (
                new Date(employee.date_of_birth).toLocaleDateString()
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <FormInput
                  type="date"
                  value={employee.start_date}
                  onChange={(e) => onChange('start_date', e.target.value)}
                />
              ) : (
                new Date(employee.start_date).toLocaleDateString()
              )}
            </dd>
          </div>
          {employee.end_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <FormInput
                    type="date"
                    value={employee.end_date}
                    onChange={(e) => onChange('end_date', e.target.value)}
                  />
                ) : (
                  new Date(employee.end_date).toLocaleDateString()
                )}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500">Salary</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <FormInput
                  type="number"
                  value={employee.salary}
                  onChange={(e) => onChange('salary', Number(e.target.value))}
                />
              ) : (
                `$${employee.salary.toLocaleString()}`
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <select
                  value={employee.is_active ? "true" : "false"}
                  onChange={(e) => onChange('is_active', e.target.value === "true")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              ) : (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  employee.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.is_active ? 'Active' : 'Inactive'}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 