import { useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Photo
      </label>
      <div className="mt-1 flex items-center">
        {preview ? (
          <div className="relative w-24 h-24">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="ml-4"
        />
      </div>
    </div>
  );
} 