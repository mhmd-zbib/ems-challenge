interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function FormInput({ 
  label, 
  error, 
  required, 
  className = "", 
  ...props 
}: FormInputProps) {
  const id = props.id || props.name;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        id={id}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2
          ${error ? 'border-red-500' : 'border-gray-300'} 
          focus:border-indigo-100 focus:ring-indigo-500
          ${className}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 