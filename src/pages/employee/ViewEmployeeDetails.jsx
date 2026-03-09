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
  UserCircle,
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

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl max-h-[60vh] overflow-y-auto">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : (
          <>
            <h3 className="font-bold text-xl mb-6">Employee Profile</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* PROFILE CARD */}
              <div className="card bg-base-100 border border-base-200 shadow p-6 flex flex-col items-center text-center">

                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserCircle size={70} />
                </div>

                <h2 className="text-lg font-bold mt-4">
                  {employee.firstName} {employee.lastName}
                </h2>

                <p className="opacity-70">{employee.designation}</p>
                <p className="text-sm opacity-60">{employee.departmentName}</p>

                <div className="divider"></div>

                <div className="text-sm space-y-2 text-left w-full">
                  <p className="flex items-center gap-2">
                    <Mail size={16}/> {employee.email || "-"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={16}/> {employee.phoneNumber || "-"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar size={16}/> {formatDate(employee.joiningDate)}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-sm mr-2">Status:</span>
                  <span
                    className={`badge ${
                      employee.status === "ACTIVE"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>

              </div>

              {/* DETAILS */}
              <div className="lg:col-span-2 space-y-6">

                {/* PERSONAL */}
                <div className="card bg-base-100 border border-base-200 shadow">
                  <div className="card-body">
                    <h4 className="font-semibold mb-4">
                      Personal Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <InfoItem
                        icon={<User />}
                        label="Full Name"
                        value={`${employee.firstName} ${employee.lastName}`}
                      />

                      <InfoItem
                        icon={<Mail />}
                        label="Email"
                        value={employee.email}
                      />

                      <InfoItem
                        icon={<Phone />}
                        label="Phone"
                        value={employee.phoneNumber}
                      />

                      <InfoItem
                        icon={<Calendar />}
                        label="Date of Birth"
                        value={formatDate(employee.dateOfBirth)}
                      />

                    </div>
                  </div>
                </div>

                {/* WORK */}
                <div className="card bg-base-100 border border-base-200 shadow">
                  <div className="card-body">
                    <h4 className="font-semibold mb-4">
                      Work Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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

                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-outline" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 border border-base-200 rounded-lg">
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
