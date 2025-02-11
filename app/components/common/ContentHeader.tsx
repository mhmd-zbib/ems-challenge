import { Button } from "~/components/common/Button";
import { FormInput } from "~/components/common/FormInput";

interface ContentHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  viewControls?: React.ReactNode;
  filterControls?: React.ReactNode;
}

export function ContentHeader({ 
  title, 
  searchTerm, 
  onSearchChange, 
  onSearch,
  viewControls,
  filterControls 
}: ContentHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {viewControls}
        </div>
        <div className="flex gap-4">
          {filterControls}
          <form onSubmit={onSearch} className="flex gap-3">
            <FormInput
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}`}
              className="w-[300px] h-12 px-4 text-lg rounded-lg"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
    </div>
  );
} 