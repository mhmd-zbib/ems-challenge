import { useLoaderData, useNavigate, useSearchParams } from "react-router"
import { getDB } from "~/db/getDB"
import type { Employee } from "~/types/employee"
import { useState } from "react"
import { FormInput } from "~/components/form/FormInput"
import { NavLink } from "~/components/navigation/NavLink"
import { Button } from "~/components/form/Button"

const ITEMS_PER_PAGE = 10

interface LoaderData {
  employees: Employee[]
  total: number
  page: number
  totalPages: number
  sortBy: string
  sortOrder: string
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const search = url.searchParams.get("search") || ""
  const sortBy = url.searchParams.get("sortBy") || "id"
  const sortOrder = url.searchParams.get("sortOrder") || "asc"
  const department = url.searchParams.get("department") || ""

  const db = await getDB()

  let query = "SELECT * FROM employees WHERE 1=1"
  const params: any[] = []

  if (search) {
    query += " AND (full_name LIKE ? OR email LIKE ? OR job_title LIKE ?)"
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  if (department) {
    query += " AND department = ?"
    params.push(department)
  }

  const countResult = await db.get(
    `SELECT COUNT(*) as count FROM (${query})`,
    params
  )
  const total = countResult.count

  query += ` ORDER BY ${sortBy} COLLATE NOCASE ${sortOrder.toUpperCase()}`
  query += ` LIMIT ? OFFSET ?`
  params.push(ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE)

  const employees = await db.all(query, params)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return {
    employees,
    total,
    page,
    totalPages,
    sortBy,
    sortOrder
  }
}

export default function EmployeesPage() {
  const { employees, page, totalPages, sortBy, sortOrder } = useLoaderData<LoaderData>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(prev => {
      prev.set("search", searchTerm)
      prev.set("page", "1")
      return prev
    })
  }

  const handleSort = (column: string) => {
    setSearchParams(prev => {
      const currentSortBy = prev.get("sortBy")
      const currentOrder = prev.get("sortOrder")

      prev.set("page", "1")

      if (currentSortBy === column) {
        prev.set("sortOrder", currentOrder === "asc" ? "desc" : "asc")
      } else {
        prev.set("sortBy", column)
        prev.set("sortOrder", "asc")
      }

      return prev
    })
  }

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    return `?${params.toString()}`
  }

  const navigate = useNavigate();

  const handleRowClick = (employeeId: number) => {
    navigate(`/employees/${employeeId}`);
  };


  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav className="bg-white shadow-sm mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex">
              <div className="flex space-x-8">
                <NavLink href="/employees">
                  Employees
                </NavLink>
                <NavLink href="/timesheets">
                  Timesheets
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <NavLink
                href="/employees/new"
              >
                Add Employee
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
            </div>
            <form onSubmit={handleSearch}>
              <div className="flex gap-3">
                <FormInput
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employees"
                  className="w-[300px] h-12 px-4 text-lg rounded-lg"
                />
                <Button
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {[
                  { key: "id", label: "ID", width: "w-[80px]" },
                  { key: "full_name", label: "Full Name", width: "w-[250px]" },
                  { key: "email", label: "Email", width: "w-[250px]" },
                  { key: "job_title", label: "Job Title", width: "w-[200px]" },
                  { key: "department", label: "Department", width: "w-[200px]" },
                  { key: "start_date", label: "Start Date", width: "w-[150px]" },
                ].map(({ key, label, width }) => (
                  <th
                    key={key}
                    className={`${width} px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortBy === key && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(employee.id)}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(employee.id);
                    }
                  }}
                >
                  <td className="w-[80px] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.id}
                  </td>
                  <td className="w-[250px] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.full_name}
                  </td>
                  <td className="w-[250px] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="w-[200px] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.job_title}
                  </td>
                  <td className="w-[200px] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department}
                  </td>
                  <td className="w-[150px] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.start_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  )
}
