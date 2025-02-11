import { useState, useEffect, useCallback } from "react";
import type { ValidationErrors } from "~/types/timesheet";

interface TimesheetFormState {
  startTime: string;
  endTime: string;
  notes: string;
  clientErrors: ValidationErrors;
}

export function useTimesheetForm() {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};
    
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours <= 0) {
        errors.endTime = "End time must be after start time";
      }
      
      if (diffInHours > 24) {
        errors.endTime = "Timesheet duration cannot exceed 24 hours";
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }, [startTime, endTime]);

  useEffect(() => {
    validateForm();
  }, [startTime, endTime, validateForm]);

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    notes,
    setNotes,
    clientErrors,
    validateForm
  };
} 