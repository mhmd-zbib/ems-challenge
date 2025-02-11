import { getDB } from "~/db/getDB";
import { timesheetQueries } from "~/queries/timesheetQueries";
import type { 
  Timesheet, 
  TimesheetFilters, 
  TimesheetDetails,
  CreateTimesheetData,
  ValidationErrors 
} from "~/types/timesheet";
import type { Employee } from "~/types/employee";

// Simple in-memory cache
const cache = new Map<string, {
  data: any,
  timestamp: number
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FetchTimesheetsResult {
  timesheets: Timesheet[];
  total: number;
  totalPages: number;
}

export const timesheetService = {
  async fetchTimesheets({
    page,
    search = "",
    sortBy = "timesheets.id",
    sortOrder = "asc",
    employeeId = "",
    itemsPerPage = 10
  }: TimesheetFilters): Promise<FetchTimesheetsResult> {
    const cacheKey = `timesheets-${page}-${search}-${sortBy}-${sortOrder}-${employeeId}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const db = await getDB();
    let query = timesheetQueries.fetchTimesheets;
    const params: any[] = [];

    if (search) {
      query += " AND employees.full_name LIKE ?";
      params.push(`%${search}%`);
    }

    if (employeeId) {
      query += " AND employees.id = ?";
      params.push(employeeId);
    }

    // Execute queries in parallel
    const [countResult, timesheets] = await Promise.all([
      db.get(`SELECT COUNT(*) as count FROM (${query})`, params),
      db.all(`${query} ORDER BY ${sortBy} COLLATE NOCASE ${sortOrder.toUpperCase()} LIMIT ? OFFSET ?`,
        [...params, itemsPerPage, (page - 1) * itemsPerPage])
    ]);

    const result = {
      timesheets: timesheets.map(timesheet => ({
        ...timesheet,
        start_time: new Date(timesheet.start_time).toISOString(),
        end_time: new Date(timesheet.end_time).toISOString(),
      })),
      total: countResult.count,
      totalPages: Math.ceil(countResult.count / itemsPerPage)
    };

    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  },

  async fetchEmployees(): Promise<Employee[]> {
    const db = await getDB();
    return db.all("SELECT id, full_name FROM employees ORDER BY full_name");
  },

  async fetchTimesheetDetails(timesheetId: string | number): Promise<TimesheetDetails> {
    const db = await getDB();
    
    const timesheet = await db.get<TimesheetDetails>(`
      SELECT 
        t.*,
        e.full_name as employee_name
      FROM timesheets t
      JOIN employees e ON t.employee_id = e.id
      WHERE t.id = ?
    `, timesheetId);

    if (!timesheet) {
      throw new Error("Timesheet not found");
    }

    return timesheet;
  },

  async validateTimesheet(data: CreateTimesheetData): Promise<ValidationErrors> {
    const db = await getDB();
    const errors: ValidationErrors = {};

    // Check if employee exists
    const employee = await db.get("SELECT id FROM employees WHERE id = ?", data.employeeId);
    if (!employee) {
      errors.employeeId = "Selected employee does not exist";
      return errors;
    }

    // Check for overlapping timesheets
    const overlapping = await db.get(
      `SELECT id FROM timesheets 
       WHERE employee_id = ? 
       AND (
         (start_time <= ? AND end_time >= ?) OR
         (start_time <= ? AND end_time >= ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [data.employeeId, data.startTime, data.startTime, data.endTime, data.endTime, data.startTime, data.endTime]
    );

    if (overlapping) {
      errors.general = "This timesheet overlaps with an existing timesheet for this employee";
    }

    return errors;
  },

  async createTimesheet(data: CreateTimesheetData): Promise<void> {
    const db = await getDB();
    
    try {
      await db.run('BEGIN TRANSACTION');

      // Check for overlapping timesheets
      const overlapping = await db.get(
        `SELECT id FROM timesheets 
         WHERE employee_id = ? 
         AND start_time < ? 
         AND end_time > ?
         LIMIT 1`,
        [data.employeeId, data.endTime, data.startTime]
      );

      if (overlapping) {
        throw new Error('Overlapping timesheet exists');
      }

      await db.run(
        `INSERT INTO timesheets (employee_id, start_time, end_time, summary) 
         VALUES (?, ?, ?, ?)`,
        [data.employeeId, data.startTime, data.endTime, data.summary]
      );

      await db.run('COMMIT');

      // Invalidate cache
      for (const key of cache.keys()) {
        if (key.startsWith('timesheets-')) {
          cache.delete(key);
        }
      }

    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
}; 