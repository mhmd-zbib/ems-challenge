import { useState, useRef } from 'react';

interface ImageUploadPreviewProps {
  onChange: (file: File | null) => void;
  error?: string;
}

export function ImageUploadPreview({ onChange, error }: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onChange(null);
        setPreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Container */}
      <div className="relative inline-block">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors"
              aria-label="Remove photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
            <svg 
              className="w-10 h-10 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex flex-col items-center space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="profile-picture"
        />
        <label
          htmlFor="profile-picture"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {preview ? 'Change Profile Picture' : 'Upload Profile Picture'}
        </label>
        
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}