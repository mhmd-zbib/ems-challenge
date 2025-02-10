import React from 'react';

interface PageHeaderProps {
    title: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}