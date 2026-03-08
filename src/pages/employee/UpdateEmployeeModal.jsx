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

const UpdateEmployeeModal = ({ employeeId, onClose, onSuccess }) => {
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

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // 🔹 Validation Function
  const validate = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be 10 digits";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth required";
    }

    if (!formData.designation?.trim()) {
      newErrors.designation = "Designation required";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department required";
    }

    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = "Salary must be positive";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      await updateEmployee(employeeId, formData);
      toast.success("Employee updated");
      onSuccess?.();
      onClose();
    } catch {
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
            error={errors.firstName}
            onChange={(val) => handleChange("firstName", val)}
          />

          <InputField
            icon={<User />}
            placeholder="Last Name"
            value={formData.lastName || ""}
            error={errors.lastName}
            onChange={(val) => handleChange("lastName", val)}
          />

          <InputField
            icon={<Mail />}
            placeholder="Email"
            value={formData.email || ""}
            error={errors.email}
            onChange={(val) => handleChange("email", val)}
          />

          <InputField
            icon={<Phone />}
            placeholder="Phone"
            value={formData.phoneNumber || ""}
            error={errors.phoneNumber}
            onChange={(val) => handleChange("phoneNumber", val)}
          />

          <InputField
            icon={<Calendar />}
            placeholder="Date of Birth"
            type="date"
            value={formData.dateOfBirth || ""}
            error={errors.dateOfBirth}
            onChange={(val) => handleChange("dateOfBirth", val)}
          />

          <InputField
            icon={<Briefcase />}
            placeholder="Designation"
            value={formData.designation || ""}
            error={errors.designation}
            onChange={(val) => handleChange("designation", val)}
          />

          <SelectField
            icon={<Users />}
            options={departments.map((d) => ({
              label: d.departmentName,
              value: d.departmentId,
            }))}
            placeholder="Select Department"
            value={formData.departmentId || ""}
            error={errors.departmentId}
            onChange={(val) => handleChange("departmentId", val)}
          />

          <InputField
            icon={<DollarSign />}
            placeholder="Salary"
            type="number"
            value={formData.salary || ""}
            error={errors.salary}
            onChange={(val) => handleChange("salary", val)}
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
}) => (
  <div>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input input-bordered w-full pl-10 ${
          error ? "input-error" : ""
        }`}
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
}) => (
  <div>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <select
        className={`select select-bordered w-full pl-10 ${
          error ? "select-error" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
