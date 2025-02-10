import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white shadow rounded-lg ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            {children}
        </div>
    );
}

export function CardBody({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-5 sm:p-6">
            {children}
        </div>
    );
}