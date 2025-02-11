import { FormInput } from "~/components/FormInput";
import { Button } from "~/components/Button";
import { FormContainer } from "~/components/Form";
import { ImageUploadPreview } from "~/components/ImageUploadPreview";
import { DocumentUpload } from "~/components/DocumentUpload";
import { useNewEmployeeForm } from "~/hooks/useNewEmployeeForm";
import type { ValidationErrors } from "~/types/employee";

interface NewEmployeeFormProps {
  errors: ValidationErrors;
}

export function NewEmployeeForm({ errors }: NewEmployeeFormProps) {
  const { 
    formRef, 
    handlePhotoChange, 
    handleBlur, 
    handleChange,
    fieldErrors 
  } = useNewEmployeeForm();

  const combinedErrors = { ...fieldErrors, ...errors };

  return (
    <FormContainer
      ref={formRef}
      method="post"
      encType="multipart/form-data"
      error={combinedErrors._form}
      replace
    >
      <div className="justify-center items-center flex">
        <ImageUploadPreview
          onChange={handlePhotoChange}
          error={combinedErrors.photo}
        />
      </div>

      <FormInput
        label="Full Name"
        name="full_name"
        required
        error={combinedErrors.full_name}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        required
        pattern="[^@\s]+@[^@\s]+\.[^\s@]+"
        title="Please enter a valid email address"
        error={combinedErrors.email}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Date of Birth"
        name="date_of_birth"
        type="date"
        required
        max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
        error={combinedErrors.date_of_birth}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Job Title"
        name="job_title"
        required
        error={combinedErrors.job_title}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Department"
        name="department"
        required
        error={combinedErrors.department}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Salary"
        name="salary"
        type="number"
        min="15000"
        required
        error={combinedErrors.salary}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <FormInput
        label="Start Date"
        name="start_date"
        type="date"
        required
        error={combinedErrors.start_date}
        onBlur={handleBlur}
        onChange={handleChange}
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
        error={combinedErrors.cv}
      />

      <DocumentUpload
        label="ID Document"
        name="id_document"
        accept=".pdf,.jpg,.jpeg,.png"
        error={combinedErrors.id_document}
      />

      <div className="flex gap-4 justify-end">
        <Button type="submit">
          Create Employee
        </Button>
      </div>
    </FormContainer>
  );
} 