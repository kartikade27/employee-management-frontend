import React, { useEffect, useState } from "react";
import { getEmployeeById } from "../../service/EmployeeService";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  Loader2,
} from "lucide-react";

const ViewEmployeeDetails = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await getEmployeeById(employeeId);
        setEmployee(res.data);
      } catch {
        toast.error("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";
  const formatSalary = (salary) =>
    salary ? `₹ ${Number(salary).toLocaleString()}` : "-";

  if (loading)
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-5xl flex justify-center py-20">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </div>
    );

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-lg mb-4">Employee Profile</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="card bg-base-100 border border-base-200 shadow">
            <div className="card-body">
              <h4 className="font-semibold mb-3">Personal Information</h4>
              <InfoItem
                icon={<User />}
                label="Name"
                value={`${employee.firstName} ${employee.lastName}`}
              />
              <InfoItem icon={<Mail />} label="Email" value={employee.email} />
              <InfoItem
                icon={<Phone />}
                label="Phone"
                value={employee.phoneNumber}
              />
              <InfoItem
                icon={<Calendar />}
                label="DOB"
                value={formatDate(employee.dateOfBirth)}
              />
            </div>
          </div>

          {/* Work Info */}
          <div className="card bg-base-100 border border-base-200 shadow">
            <div className="card-body">
              <h4 className="font-semibold mb-3">Work Information</h4>
              <InfoItem
                icon={<Briefcase />}
                label="Designation"
                value={employee.designation}
              />
              <InfoItem
                icon={<Users />}
                label="Department"
                value={employee.departmentName}
              />
              <InfoItem
                icon={<DollarSign />}
                label="Salary"
                value={formatSalary(employee.salary)}
              />
              <InfoItem
                icon={<Calendar />}
                label="Joining Date"
                value={formatDate(employee.joiningDate)}
              />
              <div className="mt-3">
                <span className="text-sm mr-2">Status:</span>
                <span
                  className={`badge ${employee.status === "ACTIVE" ? "badge-success" : "badge-error"}`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="p-2 bg-primary/10 rounded-lg text-primary">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div>
      <p className="text-xs opacity-60">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  </div>
);

export default ViewEmployeeDetails;
