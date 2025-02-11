import { useLoaderData, useNavigate, useSearchParams } from "react-router"
import { getDB } from "~/db/getDB"
import type { Employee } from "~/types/employee"
import { useState } from "react"
import { FormInput } from "~/components/FormInput"
import { NavLink } from "~/components/NavLink"
import { Button } from "~/components/Button"
import { PageLayout } from "~/components/PageLayout"
import { ContentHeader } from "~/components/ContentHeader"
import { DataTable } from "~/components/DataTable"
import {Pagination} from "~/components/Pagination";

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

  const columns = [
    { key: "id", label: "ID", width: "w-[80px]" },
    { key: "full_name", label: "Full Name", width: "w-[250px]" },
    { key: "email", label: "Email", width: "w-[250px]" },
    { key: "job_title", label: "Job Title", width: "w-[200px]" },
    { key: "department", label: "Department", width: "w-[200px]" },
    { 
      key: "start_date", 
      label: "Start Date", 
      width: "w-[150px]",
      format: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  return (
    <PageLayout 
      title="Employees" 
      addButtonLink="/employees/new" 
      addButtonText="Add Employee"
    >
      <ContentHeader
        title="Employees"
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        onSearch={handleSearch}
      />
      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={columns}
          data={employees}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />
        <Pagination
            page={page}
            totalPages={totalPages}
            buildPageUrl={buildPageUrl}
        />
      </div>
    </PageLayout>
  )
}
