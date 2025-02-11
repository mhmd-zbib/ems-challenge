import { useLoaderData } from "react-router";
import { employeeService } from "~/services/employeeService";
import { useEmployeeEdit } from "~/hooks/useEmployeeEdit";
import { EmployeeHeader } from "~/components/employees/EmployeeHeader";
import { EmployeeDetails } from "~/components/employees/EmployeeDetails";
import { EmployeeDocuments } from "~/components/employees/EmployeeDocuments";
import { NavLink } from "~/components/common/NavLink";
import type { Employee } from "~/types/employee";

export async function loader({ params }: any) {
  return employeeService.fetchEmployeeDetails(params.employeeId);
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  return employeeService.updateEmployee(params.employeeId, Object.fromEntries(formData));
}

export default function EmployeePage() {
  const employee = useLoaderData<Employee>();
  const {
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleSave
  } = useEmployeeEdit(employee);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div className="flex space-x-4 items-center">
          <NavLink href="/employees">
            Employees
          </NavLink>
          <NavLink href="/timesheets">
            Timesheets
          </NavLink>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <EmployeeHeader
          employee={formData}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          onChange={handleInputChange}
        />
        
        <EmployeeDetails
          employee={formData}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
        
        <EmployeeDocuments documents={employee.documents} />
      </div>
    </div>
  );
}
