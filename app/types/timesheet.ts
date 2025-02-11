export interface Timesheet {
  id: number;
  employee_id: number;
  start_time: string;
  end_time: string;
  full_name: string;
}

export interface TimesheetFilters {
  page: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  employeeId?: string;
  itemsPerPage?: number;
}

export interface ValidationErrors {
  _form?: string;
  employeeId?: string;
  startTime?: string;
  endTime?: string;
  general?: string;
}

export interface TimesheetDetails {
  id: number;
  employee_id: number;
  employee_name: string;
  start_time: string;
  end_time: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTimesheetData {
  employeeId: string;
  startTime: string;
  endTime: string;
  summary?: string;
} 