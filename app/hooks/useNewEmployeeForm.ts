import { useRef, useState, useCallback } from "react";
import { validateEmployeeField } from "~/utils/validation";
import type { ValidationErrors } from "~/types/employee";

export function useNewEmployeeForm() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
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

  const validateField = useCallback((name: string, value: string) => {
    const error = validateEmployeeField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return error;
  }, []);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    validateField(name, value);
  }, [validateField]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setFieldErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    photoFile,
    formRef,
    fieldErrors,
    handlePhotoChange,
    handleBlur,
    handleChange
  };
} 