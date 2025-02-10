import { EmployeeFormData, EmployeeErrors } from '../types/employee';
import { MINIMUM_AGE, MINIMUM_SALARY } from '../constants/employee';

export function validateEmployeeForm(data: EmployeeFormData): EmployeeErrors {
    const errors: EmployeeErrors = {};
    const today = new Date();

    // Required fields
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';

    // Email validation
    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    // Phone validation (basic)
    if (data.phoneNumber && !/^\+?[\d\s-()]+$/.test(data.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format';
    }

    // Date of Birth validation
    if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < MINIMUM_AGE) {
            errors.dateOfBirth = `Employee must be at least ${MINIMUM_AGE} years old`;
        }
    }

    // Professional info validation
    if (!data.jobTitle?.trim()) errors.jobTitle = 'Job title is required';
    if (!data.department?.trim()) errors.department = 'Department is required';

    // Salary validation
    if (!data.salary) {
        errors.salary = 'Salary is required';
    } else if (data.salary < MINIMUM_SALARY) {
        errors.salary = `Salary must be at least $${MINIMUM_SALARY}`;
    }

    // Date validations
    if (!data.startDate) {
        errors.startDate = 'Start date is required';
    } else if (new Date(data.startDate) > today) {
        errors.startDate = 'Start date cannot be in the future';
    }

    if (data.endDate && data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
        errors.endDate = 'End date must be after start date';
    }

    return errors;
}