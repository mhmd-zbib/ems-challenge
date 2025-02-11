interface TimesheetDetailsContentProps {
  startTime: string;
  endTime: string;
  summary: string | null;
}

export function TimesheetDetailsContent({ 
  startTime, 
  endTime, 
  summary 
}: TimesheetDetailsContentProps) {
  return (
    <div className="p-6">
      <dl className="grid grid-cols-2 gap-6">
        <div>
          <dt className="text-sm font-medium text-gray-500">Start Time</dt>
          <dd className="mt-1 text-sm text-gray-900">{startTime}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">End Time</dt>
          <dd className="mt-1 text-sm text-gray-900">{endTime}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-sm font-medium text-gray-500">Work Summary</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {summary || 'No summary provided'}
          </dd>
        </div>
      </dl>
    </div>
  );
} 