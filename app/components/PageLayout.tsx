import { NavLink } from "~/components/NavLink";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  addButtonLink?: string;
  addButtonText?: string;
  currentPath: string
}

export function PageLayout({ children, title, addButtonLink, addButtonText, currentPath }: PageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav className="bg-white shadow-sm mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex">
              <div className="flex space-x-8">
                <NavLink href="/employees">Employees</NavLink>
                <NavLink href="/timesheets">Timesheets</NavLink>
              </div>
            </div>
            {addButtonLink && (
              <div className="flex items-center">
                <NavLink href={addButtonLink}>{addButtonText || "Add New"}</NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-white shadow rounded-lg">
        {children}
      </div>
    </div>
  );
} 