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

export interface Document {
  id: number;
  document_type: 'CV' | 'ID' | 'CONTRACT' | 'OTHER';
  file_path: string;
  upload_date: string;
}

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  date_of_birth: string;
  job_title: string;
  department: string;
  salary: number;
  start_date: string;
  end_date: string | null;
  photo_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  documents: Document[];
  documents_json?: string; // For SQLite JSON aggregation
} 