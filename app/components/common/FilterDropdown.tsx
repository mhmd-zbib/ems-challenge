interface FilterOption {
  id: number | string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
}

export function FilterDropdown({ value, onChange, options, placeholder = "All" }: FilterDropdownProps) {
  return (
    <select
      className="rounded-lg border-gray-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 