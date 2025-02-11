import { useLoaderData, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";
import { NavLink } from "~/components/NavLink";
import { Button } from "~/components/Button";
import { FormInput } from "~/components/FormInput";
import { useState } from "react";

interface EmployeeDetails {
  documents_json: any;
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

export async function loader({ params }: any) {
  const db = await getDB();

  try {
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

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const db = await getDB();

  try {
    await db.run(`
      UPDATE employees 
      SET 
        full_name = ?,
        email = ?,
        phone_number = ?,
        job_title = ?,
        department = ?,
        salary = ?,
        photo_path = ?
      WHERE id = ?
    `,
      formData.get('full_name'),
      formData.get('email'),
      formData.get('phone_number'),
      formData.get('job_title'),
      formData.get('department'),
      formData.get('salary'),
      formData.get('photo_path'),
      params.employeeId
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating employee:", error);
    throw new Error("Failed to update employee details");
  }
}

export default function EmployeePage() {
  const employee = useLoaderData<EmployeeDetails>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof EmployeeDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        form.append(key, value.toString());
      }
    });

    try {
      await fetch(`/employees/${employee.id}`, {
        method: 'POST',
        body: form,
      });
      setIsEditing(false);
      navigate('.', { replace: true });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const documentsByType = employee.documents.reduce((acc, doc) => {
    acc[doc.document_type] = doc;
    return acc;
  }, {} as Record<string, typeof employee.documents[0]>);

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img
                src={employee.photo_path!}
                alt={employee.full_name}
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {isEditing ? (
                    <>
                      <FormInput
                        label="Full Name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                      />
                      <FormInput
                        label="Job Title"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange('job_title', e.target.value)}
                      />
                      <FormInput
                        label="Department"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900">{employee.full_name}</h2>
                      <p className="text-gray-600">{employee.job_title}</p>
                      <p className="text-gray-600">{employee.department}</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button size="sm" variant="primary" onClick={handleSave}>
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                      Edit Employee
                    </Button>
                  )}
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
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <FormInput
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  employee.email
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <FormInput
                    value={formData.phone_number || ''}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  />
                ) : (
                  employee.phone_number || 'Not provided'
                )}
              </dd>
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
                {isEditing ? (
                  <FormInput
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                  />
                ) : (
                  `$${employee.salary.toLocaleString()}`
                )}
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
    </div>
  );
}
