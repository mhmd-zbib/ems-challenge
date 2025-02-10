import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export function Form({ children, className = '', ...props }: FormProps) {
    return (
        <form
            className={`space-y-6 ${className}`}
            {...props}
        >
            {children}
        </form>
    );
}

interface FormFieldProps {
    children: React.ReactNode;
    error?: string;
    label?: string;
}

export function FormField({ children, error, label }: FormFieldProps) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            {children}
            {error && (
                <p className="text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}