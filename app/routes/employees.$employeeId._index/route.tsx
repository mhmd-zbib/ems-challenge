import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { NavLink } from "~/components/navigation/NavLink";
import { Button } from "~/components/form/Button";

interface EmployeeDetails {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  date_of_birth: string;
  job_title: string;
  department: string;
  salary: number;
  start_date: string;
  end_date: string | null;
  photo_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  documents: {
    id: number;
    document_type: 'CV' | 'ID' | 'CONTRACT' | 'OTHER';
    file_path: string;
    upload_date: string;
  }[];
}

export async function loader({ params } : any) {
  const db = await getDB();
  
  try {
    // Get employee details with a LEFT JOIN to include documents
    const employee = await db.get<EmployeeDetails>(`
      SELECT 
        e.*,
        GROUP_CONCAT(
          json_object(
            'id', d.id,
            'document_type', d.document_type,
            'file_path', d.file_path,
            'upload_date', d.upload_date
          )
        ) as documents_json
      FROM employees e
      LEFT JOIN documents d ON e.id = d.employee_id
      WHERE e.id = ?
      GROUP BY e.id
    `, params.employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Parse the documents JSON
    const documents = employee.documents_json 
      ? JSON.parse(`[${employee.documents_json}]`)
      : [];

    return {
      ...employee,
      documents
    };
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw new Error("Failed to load employee details");
  }
}

export default function EmployeePage() {
  const employee = useLoaderData<EmployeeDetails>();

  // Group documents by type
  const documentsByType = employee.documents.reduce((acc, doc) => {
    acc[doc.document_type] = doc;
    return acc;
  }, {} as Record<string, typeof employee.documents[0]>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div className="flex space-x-4 items-center">
          <NavLink href="/employees">
            Employees
          </NavLink>
          <NavLink href="/timesheets">
            Timesheets
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {employee.photo_path ? (
                <img
                  src={employee.photo_path}
                  alt={employee.full_name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{employee.full_name}</h2>
                  <p className="text-gray-600">{employee.job_title}</p>
                  <p className="text-gray-600">{employee.department}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-2 py-1 rounded-full text-sm ${
                    employee.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.phone_number || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(employee.start_date).toLocaleDateString()}
                </dd>
              </div>
              {employee.end_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(employee.end_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${employee.salary.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Documents Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* CV Document */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">CV Document</h4>
                  {documentsByType['CV'] ? (
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(documentsByType['CV'].upload_date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No CV uploaded</p>
                  )}
                </div>
                {documentsByType['CV'] && (
                  <a 
                    href={documentsByType['CV'].file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View CV
                  </a>
                )}
              </div>
            </div>

            {/* ID Document */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">ID Document</h4>
                  {documentsByType['ID'] ? (
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(documentsByType['ID'].upload_date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No ID uploaded</p>
                  )}
                </div>
                {documentsByType['ID'] && (
                  <a 
                    href={documentsByType['ID'].file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View ID
                  </a>
                )}
              </div>
            </div>

            {/* Other Documents */}
            {employee.documents
              .filter(doc => !['CV', 'ID'].includes(doc.document_type))
              .map(doc => (
                <div 
                  key={doc.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.document_type}</h4>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(doc.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                    <a 
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <Button 
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button>
            Edit Employee
          </Button>
        </div>
      </div>
    </div>
  );
}
