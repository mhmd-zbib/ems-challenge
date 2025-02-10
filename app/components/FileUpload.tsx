import React, { useRef, useState } from 'react';

interface FileUploadProps {
    accept?: string;
    onChange: (file: File | null) => void;
    value?: File | null;
    preview?: boolean;
    maxSize?: number; // in bytes
    label?: string;
    error?: string;
}

export function FileUpload({
                               accept = 'image/*',
                               onChange,
                               value,
                               preview = false,
                               maxSize,
                               label = 'Upload file',
                               error
                           }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            if (maxSize && file.size > maxSize) {
                alert(`File size should not exceed ${maxSize / 1024 / 1024}MB`);
                return;
            }

            if (preview) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }

        onChange(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files?.[0] || null;
        if (file) {
            if (maxSize && file.size > maxSize) {
                alert(`File size should not exceed ${maxSize / 1024 / 1024}MB`);
                return;
            }

            if (preview) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
            onChange(file);
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div
                className={`border-2 border-dashed rounded-lg p-4 text-center
          ${error ? 'border-red-300' : 'border-gray-300'}
          hover:border-gray-400 transition-colors cursor-pointer`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />

                {preview && (previewUrl || value) ? (
                    <div className="space-y-2">
                        <img
                            src={previewUrl ?? (value ? URL.createObjectURL(value) : undefined)}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-500">
                            Click or drag to replace
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500">
                            Click or drag file to upload
                        </p>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
    );
}