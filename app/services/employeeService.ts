import { getDB } from "~/db/getDB"
import { employeeQueries } from "~/queries/employeeQueries"
import type { Employee } from "~/types/employee"
import { FileService } from "./fileService"

// Simple in-memory cache implementation
const cache = new Map<string, {
  data: any,
  timestamp: number
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FetchEmployeesOptions {
  page: number
  search?: string
  sortBy?: string
  sortOrder?: string
  department?: string
  itemsPerPage?: number
}

interface FetchEmployeesResult {
  employees: Employee[]
  total: number
  totalPages: number
}

export const employeeService = {
  async fetchEmployees({
    page,
    search = "",
    sortBy = "id",
    sortOrder = "asc",
    department = "",
    itemsPerPage = 10
  }: FetchEmployeesOptions): Promise<FetchEmployeesResult> {
    const cacheKey = `employees-${page}-${search}-${sortBy}-${sortOrder}-${department}`;
    const cached = cache.get(cacheKey);

    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const db = await getDB();
    let query = employeeQueries.fetchEmployees;
    const params: any[] = [];

    if (search) {
      query += " AND (full_name LIKE ? OR email LIKE ? OR job_title LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department) {
      query += " AND department = ?";
      params.push(department);
    }

    // Execute count and data fetch in parallel
    const [countResult, employees] = await Promise.all([
      db.get(`SELECT COUNT(*) as count FROM (${query})`, params),
      db.all(`${query} ORDER BY ${sortBy} COLLATE NOCASE ${sortOrder.toUpperCase()} LIMIT ? OFFSET ?`, 
        [...params, itemsPerPage, (page - 1) * itemsPerPage])
    ]);

    const result = {
      employees,
      total: countResult.count,
      totalPages: Math.ceil(countResult.count / itemsPerPage)
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  },

  async fetchEmployeeDetails(employeeId: number | string) {
    const db = await getDB();

    try {
      const employee = await db.get<Employee>(employeeQueries.fetchEmployeeDetails, employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }

      const documents = employee.documents_json
        ? JSON.parse(`[${employee.documents_json}]`)
        : [];

      return {
        ...employee,
        documents
      };
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw new Error("Failed to load employee details");
    }
  },

  async updateEmployee(employeeId: number | string, data: Partial<Employee>) {
    const db = await getDB();

    try {
      await db.run(employeeQueries.updateEmployee,
        data.full_name,
        data.email,
        data.phone_number,
        data.job_title,
        data.department,
        data.salary,
        data.photo_path,
        employeeId
      );

      return { success: true };
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error("Failed to update employee details");
    }
  },

  async createEmployee(formData: FormData) {
    const db = await getDB();
    
    try {
      await db.run('BEGIN TRANSACTION');

      // Process files in parallel
      const [photoFile, cvFile, idFile] = [
        formData.get("photo") as File,
        formData.get("cv") as File,
        formData.get("id_document") as File
      ];

      const [photoPath, cvPath, idPath] = await Promise.all([
        photoFile?.size > 0 ? FileService.saveProfilePicture(photoFile) : null,
        cvFile?.size > 0 ? FileService.saveDocument(cvFile, 'CV') : null,
        idFile?.size > 0 ? FileService.saveDocument(idFile, 'ID') : null
      ]);

      const result = await db.run(employeeQueries.createEmployee, [
        formData.get("full_name"),
        formData.get("email"),
        formData.get("date_of_birth"),
        formData.get("job_title"),
        formData.get("department"),
        Number(formData.get("salary")),
        formData.get("start_date"),
        photoPath
      ]);

      if (cvPath || idPath) {
        await Promise.all([
          cvPath && db.run(employeeQueries.createDocument, [result.lastID, cvPath]),
          idPath && db.run(employeeQueries.createDocument, [result.lastID, idPath])
        ]);
      }

      await db.run('COMMIT');

      // Invalidate cache after successful creation
      for (const key of cache.keys()) {
        if (key.startsWith('employees-')) {
          cache.delete(key);
        }
      }

      return result.lastID;

    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
}