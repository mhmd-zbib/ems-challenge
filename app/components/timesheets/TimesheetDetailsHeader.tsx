import { NavLink } from "~/components/NavLink";

interface TimesheetDetailsHeaderProps {
  employeeName: string;
  duration: number;
}

export function TimesheetDetailsHeader({ employeeName, duration }: TimesheetDetailsHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {employeeName}
        </h2>
        <p className="text-gray-600">
          Duration: {duration} hours
        </p>
      </div>
    </div>
  );
} 