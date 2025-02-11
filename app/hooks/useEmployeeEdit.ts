import { useState } from "react";
import { useNavigate } from "react-router";
import type { Employee } from "~/types/employee";

export function useEmployeeEdit(employee: Employee) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        form.append(key, value.toString());
      }
    });

    try {
      await fetch(`/employees/${employee.id}`, {
        method: 'POST',
        body: form,
      });
      setIsEditing(false);
      navigate('.', { replace: true });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return {
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleSave
  };
} 