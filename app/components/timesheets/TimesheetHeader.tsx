import { ViewToggle } from "~/components/ViewToggle";
import { FilterDropdown } from "~/components/FilterDropdown";
import { ContentHeader } from "~/components/ContentHeader";
import type { Employee } from "~/types/employee";

interface TimesheetHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isTableView: boolean;
  onViewToggle: (isTable: boolean) => void;
  employeeId: string;
  onEmployeeFilter: (id: string) => void;
  employees: Employee[];
}

export function TimesheetHeader({
  searchTerm,
  onSearchChange,
  onSearch,
  isTableView,
  onViewToggle,
  employeeId,
  onEmployeeFilter,
  employees
}: TimesheetHeaderProps) {
  return (
    <ContentHeader
      title="Timesheets"
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
      viewControls={
        <ViewToggle
          isTableView={isTableView}
          onToggle={onViewToggle}
        />
      }
      filterControls={
        <FilterDropdown
          value={employeeId}
          onChange={onEmployeeFilter}
          options={employees.map(e => ({
            id: e.id,
            label: e.full_name
          }))}
          placeholder="All Employees"
        />
      }
    />
  );
} 