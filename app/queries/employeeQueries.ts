export const employeeQueries = {
  fetchEmployees: `
    SELECT * FROM employees WHERE 1=1
  `,

  fetchEmployeeDetails: `
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
  `,

  updateEmployee: `
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

  createEmployee: `
    INSERT INTO employees (
      full_name, email, date_of_birth, 
      job_title, department, salary, 
      start_date, photo_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  createDocument: `
    INSERT INTO documents (
      employee_id, document_type, file_path, upload_date
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `,

  checkEmailExists: `
    SELECT id FROM employees WHERE email = ?
  `
}; 