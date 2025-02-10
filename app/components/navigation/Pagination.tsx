import { NavLink } from "./NavLink";

interface PaginationProps {
  page: number;
  totalPages: number;
  buildPageUrl: (page: number) => string;
}

export function Pagination({ page, totalPages, buildPageUrl }: PaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing page <span className="font-medium">{page}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="flex gap-3">
          {page > 1 && (
            <NavLink
              href={buildPageUrl(page - 1)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </NavLink>
          )}
          {page < totalPages && (
            <NavLink
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
} 