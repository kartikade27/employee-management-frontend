import React, { useEffect, useState } from "react";
import { updateEmployee, getEmployeeById } from "../../service/EmployeeService";
import { getAllDepartments } from "../../service/DepartmentService";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Users,
} from "lucide-react";

const UpdateEmployeeModal = ({ employeeId, onClose, onSuccess, userRole }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emp = await getEmployeeById(employeeId);
        setFormData(emp.data);

        const dept = await getAllDepartments();
        setDepartments(dept.data || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Role-based edit control
  const canEdit = (field) => {
    const HR_FIELDS = ["designation", "departmentId"];

    if (userRole === "ADMIN") return true;

    if (userRole === "HR") {
      return HR_FIELDS.includes(field);
    }

    return false;
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (canEdit("firstName") && !formData.firstName?.trim())
      newErrors.firstName = "First name required";

    if (canEdit("lastName") && !formData.lastName?.trim())
      newErrors.lastName = "Last name required";

    if (canEdit("phoneNumber") && !/^[0-9]{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone must be 10 digits";

    if (canEdit("gender") && !formData.gender)
      newErrors.gender = "Gender required";

    if (canEdit("dateOfBirth") && !formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth required";

    if (canEdit("joiningDate") && !formData.joiningDate)
      newErrors.joiningDate = "Joining date required";

    if (canEdit("designation") && !formData.designation?.trim())
      newErrors.designation = "Designation required";

    if (canEdit("departmentId") && !formData.departmentId)
      newErrors.departmentId = "Department required";

    if (canEdit("salary") && (!formData.salary || formData.salary <= 0))
      newErrors.salary = "Salary must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      let updateData = {};

      if (userRole === "HR") {
        updateData = {
          designation: formData.designation,
          departmentId: formData.departmentId,
        };
      }

      if (userRole === "ADMIN") {
        updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          joiningDate: formData.joiningDate,
          designation: formData.designation,
          salary: formData.salary,
          status: formData.status,
          departmentId: formData.departmentId,
          userId: formData.userId,
        };
      }

      await updateEmployee(employeeId, updateData);

      toast.success("Employee updated successfully");

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-lg mb-5">Update Employee</h3>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <InputField
            icon={<User />}
            placeholder="First Name"
            value={formData.firstName || ""}
            onChange={(val) => handleChange("firstName", val)}
            disabled={!canEdit("firstName")}
            error={errors.firstName}
          />

          <InputField
            icon={<User />}
            placeholder="Last Name"
            value={formData.lastName || ""}
            onChange={(val) => handleChange("lastName", val)}
            disabled={!canEdit("lastName")}
            error={errors.lastName}
          />

          <InputField
            icon={<Mail />}
            placeholder="Email"
            value={formData.email || ""}
            disabled
          />

          <InputField
            icon={<Phone />}
            placeholder="Phone"
            value={formData.phoneNumber || ""}
            onChange={(val) => handleChange("phoneNumber", val)}
            disabled={!canEdit("phoneNumber")}
            error={errors.phoneNumber}
          />

          <SelectField
            icon={<User />}
            options={[
              { label: "MALE", value: "MALE" },
              { label: "FEMALE", value: "FEMALE" },
            ]}
            placeholder="Gender"
            value={formData.gender || ""}
            onChange={(val) => handleChange("gender", val)}
            disabled={!canEdit("gender")}
            error={errors.gender}
          />

          <InputField
            icon={<Calendar />}
            placeholder="Date of Birth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(val) => handleChange("dateOfBirth", val)}
            disabled={!canEdit("dateOfBirth")}
            error={errors.dateOfBirth}
          />

          <InputField
            icon={<Calendar />}
            placeholder="Joining Date"
            type="date"
            value={formData.joiningDate || ""}
            onChange={(val) => handleChange("joiningDate", val)}
            disabled={!canEdit("joiningDate")}
            error={errors.joiningDate}
          />

          <InputField
            icon={<Briefcase />}
            placeholder="Designation"
            value={formData.designation || ""}
            onChange={(val) => handleChange("designation", val)}
            disabled={!canEdit("designation")}
            error={errors.designation}
          />

          <SelectField
            icon={<Users />}
            options={departments.map((d) => ({
              label: d.departmentName,
              value: d.departmentId,
            }))}
            placeholder="Select Department"
            value={formData.departmentId || ""}
            onChange={(val) => handleChange("departmentId", val)}
            disabled={!canEdit("departmentId")}
            error={errors.departmentId}
          />

          <InputField
            icon={<DollarSign />}
            placeholder="Salary"
            type="number"
            value={formData.salary || ""}
            onChange={(val) => handleChange("salary", val)}
            disabled={!canEdit("salary")}
            error={errors.salary}
          />

          <SelectField
            icon={<User />}
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
            placeholder="Status"
            value={formData.status || ""}
            onChange={(val) => handleChange("status", val)}
            disabled={!canEdit("status")}
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary">Update</button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const InputField = ({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
}) => (
  <div>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`input input-bordered w-full pl-10 ${error ? "input-error" : ""}`}
        disabled={disabled}
      />
    </div>
    {error && <p className="text-error text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  icon,
  options,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
}) => (
  <div>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <select
        className={`select select-bordered w-full pl-10 ${error ? "select-error" : ""}`}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>

    {error && <p className="text-error text-sm mt-1">{error}</p>}
  </div>
);

export default UpdateEmployeeModal;
