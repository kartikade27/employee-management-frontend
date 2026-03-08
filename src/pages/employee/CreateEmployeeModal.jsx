import React, { useEffect, useState } from "react";
import { createEmployee } from "../../service/EmployeeService";
import { getAllDepartments } from "../../service/DepartmentService";
import { getAllUsers } from "../../service/authService";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

const CreateEmployeeModal = ({ open, onOpenChange, onCreated }) => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    designation: "",
    salary: "",
    departmentId: "",
    userId: "",
    gender: "",
    dateOfBirth: "",
    joiningDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dep = await getAllDepartments();
        const usr = await getAllUsers();
        setDepartments(dep.data || []);
        setUsers(usr.data || []);
      } catch {
        toast.error("Failed loading dropdowns");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createEmployee(formData);
      toast.success("Employee created");
      onCreated?.();
      onOpenChange(false);
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-lg mb-4">Create Employee</h3>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            id="firstName"
            icon={<User />}
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={(val) => setFormData({ ...formData, firstName: val })}
          />
          <InputField
            label="Last Name"
            id="lastName"
            icon={<User />}
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={(val) => setFormData({ ...formData, lastName: val })}
          />
          <InputField
            label="Email"
            id="email"
            icon={<Mail />}
            placeholder="Enter Email"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
          />
          <InputField
            label="Phone Number"
            id="phoneNumber"
            icon={<Phone />}
            placeholder="Enter Phone Number"
            value={formData.phoneNumber}
            onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
          />
          <InputField
            label="Designation"
            id="designation"
            icon={<Briefcase />}
            placeholder="Enter Designation"
            value={formData.designation}
            onChange={(val) => setFormData({ ...formData, designation: val })}
          />
          <InputField
            label="Salary"
            id="salary"
            icon={<DollarSign />}
            placeholder="Enter Salary"
            type="number"
            value={formData.salary}
            onChange={(val) => setFormData({ ...formData, salary: val })}
          />

          <SelectField
            label="Department"
            id="departmentId"
            icon={<Users />}
            options={departments.map((d) => ({
              label: d.departmentName,
              value: d.departmentId,
            }))}
            placeholder="Select Department"
            value={formData.departmentId}
            onChange={(val) => setFormData({ ...formData, departmentId: val })}
          />

          <SelectField
            label="Assign User"
            id="userId"
            icon={<User />}
            options={users.map((u) => ({
              label: u.username,
              value: u.userId,
            }))}
            placeholder="Select User"
            value={formData.userId}
            onChange={(val) => setFormData({ ...formData, userId: val })}
          />

          <SelectField
            label="Gender"
            id="gender"
            icon={<User />}
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
              { label: "Other", value: "OTHER" },
            ]}
            placeholder="Select Gender"
            value={formData.gender}
            onChange={(val) => setFormData({ ...formData, gender: val })}
          />

          <InputField
            label="Date of Birth"
            id="dateOfBirth"
            icon={<Calendar />}
            placeholder="Select Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
          />

          <InputField
            label="Joining Date"
            id="joiningDate"
            icon={<Calendar />}
            placeholder="Select Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(val) => setFormData({ ...formData, joiningDate: val })}
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>

            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={() => onOpenChange(false)}></div>
    </div>
  );
};

const InputField = ({ label, id, icon, value, onChange, placeholder, type = "text" }) => (
  <div className="relative w-full">
    <label htmlFor={id} className="block mb-1 font-medium text-text">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered w-full pl-10"
      />
    </div>
  </div>
);

const SelectField = ({ label, id, icon, options, placeholder, value, onChange }) => (
  <div className="relative w-full">
    <label htmlFor={id} className="block mb-1 font-medium text-text">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-primary/70">{icon}</div>
      <select
        id={id}
        className="select select-bordered w-full pl-10"
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
  </div>
);

export default CreateEmployeeModal;