import { redirect, useActionData, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { validateEmployee, validateDocuments } from "~/utils/validation";
import { FileService } from "~/services/fileService";
import { ImageUploadPreview } from "~/components/ImageUploadPreview";
import { FormInput } from "~/components/FormInput";
import { Button } from "~/components/Button";
import { FormContainer } from "~/components/Form";
import type { ValidationErrors } from "~/types/employee";
import { useState, useRef } from "react";
import { DocumentUpload } from "~/components/DocumentUpload";
import { NavLink } from "~/components/NavLink";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  let photo_path: string | undefined;

  const photoFile = formData.get("photo") as File;
  const cvFile = formData.get("cv") as File;
  const idFile = formData.get("id_document") as File;

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

    if (cvFile?.size > 0 || idFile?.size > 0) {
      const fileErrors = validateDocuments({
        cv: cvFile,
        id_document: idFile
      });

      if (Object.keys(fileErrors).length > 0) {
        return { errors: fileErrors };
      }
    }

    if (photoFile?.size > 0) {
      photo_path = await FileService.saveProfilePicture(photoFile);
    }
    
    const db = await getDB();
    const result = await db.run(
      `INSERT INTO employees (
        full_name, email, date_of_birth, 
        job_title, department, salary, 
        start_date, photo_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.full_name,
        employee.email,
        employee.date_of_birth,
        employee.job_title,
        employee.department,
        employee.salary,
        employee.start_date,
        photo_path
      ]
    );

    const employeeId = result.lastID;

    const documentUploads = [];

    if (cvFile?.size > 0) {
      const cvPath = await FileService.saveDocument(cvFile, 'CV');
      documentUploads.push(
        db.run(
          `INSERT INTO documents (
            employee_id, document_type, file_path, upload_date
          ) VALUES (?, 'CV', ?, CURRENT_TIMESTAMP)`,
          [employeeId, cvPath]
        )
      );
    }

    if (idFile?.size > 0) {
      const idPath = await FileService.saveDocument(idFile, 'ID');
      documentUploads.push(
        db.run(
          `INSERT INTO documents (
            employee_id, document_type, file_path, upload_date
          ) VALUES (?, 'ID', ?, CURRENT_TIMESTAMP)`,
          [employeeId, idPath]
        )
      );
    }

    if (documentUploads.length > 0) {
      await Promise.all(documentUploads);
    }

    return redirect("/employees");
  } catch (error) {
    console.error('Error creating employee:', error);

    if (error instanceof Error) {
      if (error.message.includes('SQLITE_CONSTRAINT')) {
        if (error.message.includes('email')) {
          return { 
            errors: { 
              email: "This email is already in use" 
            } 
          };
        }
      }
    }

    return { 
      errors: { 
        _form: "Failed to create employee. Please try again." 
      } 
    };
  }
};

export default function NewEmployeePage() {
  const actionData = useActionData<{ errors?: ValidationErrors }>();
  const errors = actionData?.errors || {};
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    if (formRef.current && file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileInput = formRef.current.querySelector('input[name="photo"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
      }
    }
  };

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
      <FormContainer
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        error={errors._form}
      >
        <div className="justify-center items-center flex">
          <ImageUploadPreview
            onChange={handlePhotoChange}
            error={errors.photo}
          />
        </div>

        <FormInput
          label="Full Name"
          name="full_name"

          required
          error={errors.full_name}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          required
          pattern="[^@\s]+@[^@\s]+\.[^\s@]+"
          title="Please enter a valid email address"
          error={errors.email}
        />

        <FormInput
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          required
          max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          error={errors.date_of_birth}
        />

        <FormInput
          label="Job Title"
          name="job_title"
          required
          error={errors.job_title}
        />

        <FormInput
          label="Department"
          name="department"
          required
          error={errors.department}
        />

        <FormInput
          label="Salary"
          name="salary"
          type="number"
          min="15000"
          required
          error={errors.salary}
        />

        <FormInput
          label="Start Date"
          name="start_date"
          type="date"
          required
          error={errors.start_date}
        />

        <input
          type="file"
          name="photo"
          hidden
          accept="image/*"
        />


        <DocumentUpload
          label="CV Document"
          name="cv"
          accept=".pdf,.doc,.docx"
          error={errors.cv}
        />

        <DocumentUpload
          label="ID Document"
          name="id_document"
          accept=".pdf,.jpg,.jpeg,.png"
          error={errors.id_document}
        />


        <div className="flex gap-4 justify-end">
          <Button type="submit">
            Create Employee
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
