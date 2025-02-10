export interface Employee {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    jobTitle: string;
    department: string;
    salary: number;
    startDate: string;
    endDate?: string;
    photo?: File | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export interface EmployeeErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    jobTitle?: string;
    department?: string;
    salary?: string;
    startDate?: string;
    endDate?: string;
    photo?: string;
}