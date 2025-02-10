interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  className = "",
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = "rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
} 