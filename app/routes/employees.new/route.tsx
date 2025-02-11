import { redirect, useActionData, type ActionFunction } from "react-router";
import { validateEmployee, validateDocuments } from "~/utils/validation";
import { employeeService } from "~/services/employeeService";
import { NewEmployeeForm } from "~/components/employees/NewEmployeeForm";
import type { ValidationErrors } from "~/types/employee";
import { NavLink } from "~/components/NavLink";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  try {
    const employee = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      job_title: formData.get("job_title") as string,
      department: formData.get("department") as string,
      salary: Number(formData.get("salary")),
      start_date: formData.get("start_date") as string,
    };

    const employeeErrors = validateEmployee(employee);
    if (Object.keys(employeeErrors).length > 0) {
      return { errors: employeeErrors };
    }

    const cvFile = formData.get("cv") as File;
    const idFile = formData.get("id_document") as File;

    if (cvFile?.size > 0 || idFile?.size > 0) {
      const fileErrors = validateDocuments({
        cv: cvFile,
        id_document: idFile
      });

      if (Object.keys(fileErrors).length > 0) {
        return { errors: fileErrors };
      }
    }

    await employeeService.createEmployee(formData);
    return redirect("/employees");
    
  } catch (error) {
    console.error('Error creating employee:', error);

    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
      if (error.message.includes('email')) {
        return { errors: { email: "This email is already in use" } };
      }
    }

    return { 
      errors: { _form: "Failed to create employee. Please try again." } 
    };
  }
};

export default function NewEmployeePage() {
  const actionData = useActionData<{ errors?: ValidationErrors }>();
  const errors = actionData?.errors || {};

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Employee</h1>
        <div className="flex space-x-4 items-center">
          <NavLink href="/employees">
            Employees
          </NavLink>
          <NavLink href="/timesheets">
            Timesheets
          </NavLink>
        </div>
      </div>
      <NewEmployeeForm errors={errors} />
    </div>
  );
}
