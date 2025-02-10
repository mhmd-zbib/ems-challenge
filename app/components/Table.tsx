import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export function Table({ children, className = '' }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-300 ${className}`}>
                {children}
            </table>
        </div>
    );
}

export function Thead({ children }: { children: React.ReactNode }) {
    return <thead className="bg-gray-50">{children}</thead>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}

export function Th({ children }: { children: React.ReactNode }) {
    return (
        <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
        >
            {children}
        </th>
    );
}

export function Td({ children }: { children: React.ReactNode }) {
    return (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
            {children}
        </td>
    );
}