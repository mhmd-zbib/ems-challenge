import { useLoaderData } from "react-router"
import { employeeService } from "~/services/employeeService"
import { EmployeeList } from "~/components/EmployeeList"
import { PageLayout } from "~/components/PageLayout"
import { ContentHeader } from "~/components/ContentHeader"
import { useListManagement } from "~/hooks/useListManagement"
import type { Employee } from "~/types/employee"

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

  const { employees, total, totalPages } = await employeeService.fetchEmployees({
    page,
    search,
    sortBy,
    sortOrder,
    department
  })

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
  const { employees, page, totalPages, sortBy, sortOrder } = useLoaderData<LoaderData>();
  
  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleSort,
    buildPageUrl,
  } = useListManagement();

  return (
    <PageLayout 
      title="Employees" 
      addButtonLink="/employees/new" 
      addButtonText="Add Employee"
      currentPath="/employees"
    >
      <ContentHeader
        title="Employees"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />
      <EmployeeList
        employees={employees}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        buildPageUrl={buildPageUrl}
      />
    </PageLayout>
  );
}
