import { useState, useEffect } from "react";
import { useCalendarApp } from '@schedule-x/react';
import { createViewDay, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import type { Timesheet } from "~/types/timesheet";

export function useTimesheetCalendar(timesheets: Timesheet[]) {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const formatDateForCalendar = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: timesheets.map((timesheet) => ({
      id: timesheet.id.toString(),
      title: timesheet.full_name,
      start: formatDateForCalendar(timesheet.start_time),
      end: formatDateForCalendar(timesheet.end_time),
    })),
    plugins: [eventsService],
    defaultView: 'week',
    translations: {
      navigation: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      }
    }
  });

  useEffect(() => {
    eventsService.getAll();
  }, []);

  return calendar;
} 