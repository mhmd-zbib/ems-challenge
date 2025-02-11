import { getDB } from "~/db/getDB"
import type { Employee } from "~/types/employee"
import { FileService } from "./fileService"

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
    params.push(itemsPerPage, (page - 1) * itemsPerPage)

    const employees = await db.all(query, params)
    const totalPages = Math.ceil(total / itemsPerPage)

    return {
      employees,
      total,
      totalPages
    }
  },

  async fetchEmployeeDetails(employeeId: number | string) {
    const db = await getDB();

    try {
      const employee = await db.get<Employee>(`
        SELECT 
          e.*,
          GROUP_CONCAT(
            json_object(
              'id', d.id,
              'document_type', d.document_type,
              'file_path', d.file_path,
              'upload_date', d.upload_date
            )
          ) as documents_json
        FROM employees e
        LEFT JOIN documents d ON e.id = d.employee_id
        WHERE e.id = ?
        GROUP BY e.id
      `, employeeId);

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
      await db.run(`
        UPDATE employees 
        SET 
          full_name = ?,
          email = ?,
          phone_number = ?,
          job_title = ?,
          department = ?,
          salary = ?,
          photo_path = ?
        WHERE id = ?
      `,
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
    
    const employee = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      job_title: formData.get("job_title") as string,
      department: formData.get("department") as string,
      salary: Number(formData.get("salary")),
      start_date: formData.get("start_date") as string,
    };

    const photoFile = formData.get("photo") as File;
    const cvFile = formData.get("cv") as File;
    const idFile = formData.get("id_document") as File;

    let photo_path: string | undefined;

    if (photoFile?.size > 0) {
      photo_path = await FileService.saveProfilePicture(photoFile);
    }

    const result = await db.run(
      `INSERT INTO employees (
        full_name, email, date_of_birth, 
        job_title, department, salary, 
        start_date, photo_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.full_name,
        employee.email,
        employee.date_of_birth,
        employee.job_title,
        employee.department,
        employee.salary,
        employee.start_date,
        photo_path
      ]
    );

    const employeeId = result.lastID;

    const documentUploads = [];

    if (cvFile?.size > 0) {
      const cvPath = await FileService.saveDocument(cvFile, 'CV');
      documentUploads.push(
        db.run(
          `INSERT INTO documents (
            employee_id, document_type, file_path, upload_date
          ) VALUES (?, 'CV', ?, CURRENT_TIMESTAMP)`,
          [employeeId, cvPath]
        )
      );
    }

    if (idFile?.size > 0) {
      const idPath = await FileService.saveDocument(idFile, 'ID');
      documentUploads.push(
        db.run(
          `INSERT INTO documents (
            employee_id, document_type, file_path, upload_date
          ) VALUES (?, 'ID', ?, CURRENT_TIMESTAMP)`,
          [employeeId, idPath]
        )
      );
    }

    if (documentUploads.length > 0) {
      await Promise.all(documentUploads);
    }

    return employeeId;
  }
}