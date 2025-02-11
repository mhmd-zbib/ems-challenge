import type { NewEmployee, ValidationErrors } from "~/types/employee";

export const validateEmployee = (employee: Partial<NewEmployee>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!employee.full_name?.trim()) {
    errors.full_name = "Full name is required";
  }

  if (!employee.email?.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(employee.email)) {
      errors.email = "Invalid email format";
    }
  }

  if (!employee.date_of_birth) {
    errors.date_of_birth = "Date of birth is required";
  } else {
    const birthDate = new Date(employee.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      errors.date_of_birth = "Employee must be at least 18 years old";
    }
  }

  if (!employee.job_title?.trim()) {
    errors.job_title = "Job title is required";
  }

  if (!employee.department?.trim()) {
    errors.department = "Department is required";
  }

  if (!employee.salary) {
    errors.salary = "Salary is required";
  } else {
    if (employee.salary < 15000) {
      errors.salary = "Salary must be at least 15000";
    }
  }

  if (!employee.start_date) {
    errors.start_date = "Start date is required";
  } else if (employee.end_date) {
    if (new Date(employee.start_date) > new Date(employee.end_date)) {
      errors.start_date = "Start date must be before end date";
    }
  }

  if (employee.phone_number) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(employee.phone_number)) {
      errors.phone_number = "Invalid phone number format";
    }
  }

  if (employee.photo_path) {
    const validImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = employee.photo_path.split('.').pop()?.toLowerCase();
    if (!extension || !validImageTypes.includes(extension)) {
      errors.photo = "Invalid image format. Allowed: JPG, PNG, GIF";
    }
  }

  return errors;
};

export function validateDocuments(files: { 
  cv?: File, 
  id_document?: File 
}) {
  const errors: Record<string, string> = {};

  if (files.cv && files.cv.size > 10 * 1024 * 1024) {
    errors.cv = "CV file must be less than 10MB";
  }

  if (files.id_document && files.id_document.size > 10 * 1024 * 1024) {
    errors.id_document = "ID document must be less than 10MB";
  }

  const allowedCvTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedIdTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ];

  if (files.cv && !allowedCvTypes.includes(files.cv.type)) {
    errors.cv = "Please upload a PDF or Word document";
  }

  if (files.id_document && !allowedIdTypes.includes(files.id_document.type)) {
    errors.id_document = "Please upload a PDF or image file";
  }

  return errors;
} 