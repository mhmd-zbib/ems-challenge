import { Button } from "~/components/common/Button";

interface ViewToggleProps {
  isTableView: boolean;
  onToggle: (isTable: boolean) => void;
}

export function ViewToggle({ isTableView, onToggle }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => onToggle(true)} 
        variant={isTableView ? "primary" : "secondary"}
      >
        Table View
      </Button>
      <Button 
        onClick={() => onToggle(false)} 
        variant={!isTableView ? "primary" : "secondary"}
      >
        Calendar View
      </Button>
    </div>
  );
} 