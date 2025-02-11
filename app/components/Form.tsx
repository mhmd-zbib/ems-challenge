import { forwardRef } from 'react';
import { Form as RouterForm } from 'react-router';
import type { ComponentProps } from "react";

interface FormContainerProps extends ComponentProps<typeof RouterForm> {
  error?: string;
}

export const FormContainer = forwardRef<HTMLFormElement, FormContainerProps>(({ 
  children, 
  error,
  className = "space-y-4",
  ...props 
}, ref) => {
  return (
    <RouterForm 
      {...props} 
      ref={ref}
      className={className}
    >
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {children}
    </RouterForm>
  );
});

FormContainer.displayName = 'FormContainer'; 