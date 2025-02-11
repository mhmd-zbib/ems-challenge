import { useMemo } from "react";
import type { TimesheetDetails } from "~/types/timesheet";

export function useTimesheetDetails(timesheet: TimesheetDetails) {
  const duration = useMemo(() => {
    const durationMs = new Date(timesheet.end_time).getTime() - 
                      new Date(timesheet.start_time).getTime();
    return Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
  }, [timesheet.start_time, timesheet.end_time]);

  const formattedStartTime = useMemo(() => 
    new Date(timesheet.start_time).toLocaleString(),
    [timesheet.start_time]
  );

  const formattedEndTime = useMemo(() => 
    new Date(timesheet.end_time).toLocaleString(),
    [timesheet.end_time]
  );

  return {
    duration,
    formattedStartTime,
    formattedEndTime
  };
} 