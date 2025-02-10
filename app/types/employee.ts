export interface NewEmployee {
  full_name: string;
  email: string;
  phone_number?: string;
  date_of_birth: string;
  job_title: string;
  department: string;
  salary: number;
  start_date: string;
  end_date?: string;
  photo_path?: string;
  is_active?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  date_of_birth: string;
  job_title: string;
  department: string;
  salary: number;
  start_date: string;
  photo_path?: string;
} 