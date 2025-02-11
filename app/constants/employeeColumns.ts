export  const employeeColumns = [
  { key: "id", label: "ID", width: "w-[80px]" },
  { key: "full_name", label: "Full Name", width: "w-[250px]" },
  { key: "email", label: "Email", width: "w-[250px]" },
  { key: "job_title", label: "Job Title", width: "w-[200px]" },
  { key: "department", label: "Department", width: "w-[200px]" },
  { 
    key: "start_date", 
    label: "Start Date", 
    width: "w-[150px]",
    format: (value: string) => new Date(value).toLocaleDateString()
  },
];
