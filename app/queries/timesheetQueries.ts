export const timesheetQueries = {
  fetchTimesheets: `
    SELECT timesheets.id AS id,
           timesheets.employee_id,
           timesheets.start_time,
           timesheets.end_time,
           employees.full_name,
           employees.id AS employee_id
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
    WHERE 1 = 1
  `,

  fetchTimesheetDetails: `
    SELECT 
      t.*,
      e.full_name as employee_name
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.id = ?
  `,

  checkEmployeeExists: `
    SELECT id FROM employees WHERE id = ?
  `,

  checkOverlappingTimesheets: `
    SELECT id FROM timesheets 
    WHERE employee_id = ? 
    AND (
      (start_time <= ? AND end_time >= ?) OR
      (start_time <= ? AND end_time >= ?) OR
      (start_time >= ? AND end_time <= ?)
    )
  `,

  createTimesheet: `
    INSERT INTO timesheets (employee_id, start_time, end_time, summary) 
    VALUES (?, ?, ?, ?)
  `,

  fetchEmployeesList: `
    SELECT id, full_name FROM employees ORDER BY full_name
  `
}; 