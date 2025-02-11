import { useState, useRef } from 'react';

interface DocumentUploadProps {
  label: string;
  name: string;
  accept?: string;
  error?: string;
  onChange?: (file: File | null) => void;
}

export function DocumentUpload({ 
  label, 
  name, 
  accept = ".pdf,.doc,.docx", 
  error,
  onChange 
}: DocumentUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file?.name || '');
    onChange?.(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div 
        className={`
          mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
          rounded-md cursor-pointer hover:border-gray-400 transition-colors
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        `}
        onClick={handleClick}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              {fileName ? fileName : 'Upload a file'}
            </span>
          </div>
          <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
      />
    </div>
  );
} 