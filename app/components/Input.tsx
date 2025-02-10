import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export function Input({ className = '', error, ...props }: InputProps) {
    return (
        <input
            className={`
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-blue-500 focus:ring-blue-500 sm:text-sm
        ${error ? 'border-red-300' : 'border-gray-300'}
        ${className}
      `}
            {...props}
        />
    );
}