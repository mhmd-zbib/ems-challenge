import { Button } from "~/components/Button";
import { FormInput } from "~/components/FormInput";
import type { Employee } from "~/types/employee";

interface EmployeeHeaderProps {
  employee: Employee;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof Employee, value: any) => void;
}

export function EmployeeHeader({
  employee,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange
}: EmployeeHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <img
            src={employee.photo_path!}
            alt={employee.full_name}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {isEditing ? (
                <>
                  <FormInput
                    label="Full Name"
                    value={employee.full_name}
                    onChange={(e) => onChange('full_name', e.target.value)}
                  />
                  <FormInput
                    label="Job Title"
                    value={employee.job_title}
                    onChange={(e) => onChange('job_title', e.target.value)}
                  />
                  <FormInput
                    label="Department"
                    value={employee.department}
                    onChange={(e) => onChange('department', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900">{employee.full_name}</h2>
                  <p className="text-gray-600">{employee.job_title}</p>
                  <p className="text-gray-600">{employee.department}</p>
                </>
              )}
            </div>
            <div className="text-right">
              {isEditing ? (
                <div className="space-x-2">
                  <Button size="sm" variant="primary" onClick={onSave}>
                    Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="secondary" onClick={onEdit}>
                  Edit Employee
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 