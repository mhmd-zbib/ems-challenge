import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
}

export function Select({
                           options,
                           value,
                           onChange,
                           placeholder = 'Select an option',
                           label,
                           error,
                           disabled,
                           searchable = false,
                       }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div>
                <button
                    type="button"
                    className={`relative w-full bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-default 
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
            ${error ? 'border-red-300' : 'border-gray-300'}
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon />
          </span>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base
          ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {searchable && (
                        <div className="px-3 py-2">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    {filteredOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50
                ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                                setSearchTerm('');
                            }}
                        >
                            <span className="block truncate">{option.label}</span>
                            {option.value === value && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <CheckIcon />
                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

function ChevronDownIcon() {
    return (
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}