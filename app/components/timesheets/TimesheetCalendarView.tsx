import { ScheduleXCalendar } from '@schedule-x/react';
import { useTimesheetCalendar } from '~/hooks/useTimesheetCalendar';
import type { Timesheet } from "~/types/timesheet";

interface TimesheetCalendarViewProps {
  timesheets: Timesheet[];
}

export function TimesheetCalendarView({ timesheets }: TimesheetCalendarViewProps) {
  const calendar = useTimesheetCalendar(timesheets);

  return (
    <div className="sx-react-calendar-wrapper h-[800px] max-h-[90vh] w-full">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
} 