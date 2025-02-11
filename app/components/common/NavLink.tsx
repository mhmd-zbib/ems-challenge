interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className = "" }: NavLinkProps) {
  return (
    <a 
      href={href}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors ${className}`}
    >
      {children}
    </a>
  );
} 