import { forwardRef } from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  error?: string;
}

export const FormContainer = forwardRef<HTMLFormElement, FormProps>(({ 
  error,
  className = "",
  children,
  ...props 
}, ref) => {
  return (
    <form 
      {...props} 
      ref={ref}
      className={`space-y-4 ${className}`}
    >
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {children}
    </form>
  );
});

FormContainer.displayName = 'FormContainer'; 