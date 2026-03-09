// src/components/employee/EmployeeUpdateProfileModal.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEmployeeById, updateEmployee } from "../../service/EmployeeService";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaDollarSign,
  FaBuilding,
  FaEnvelope,
} from "react-icons/fa";

const EmployeeUpdateProfileModal = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    joiningDate: "",
    salary: "",
    designation: "",
    departmentId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch employee details on modal open
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(employeeId);
        const emp = res.data;

        // Format dates for input[type="date"]
        const formatDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

        setFormData({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          phoneNumber: emp.phoneNumber || "",
          gender: emp.gender || "",
          dateOfBirth: formatDate(emp.dateOfBirth),
          joiningDate: formatDate(emp.joiningDate),
          salary: emp.salary || "",
          designation: emp.designation || "",
          departmentId: emp.departmentName || "", // Change to ID if backend expects numeric
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Send all required fields to backend, including read-only ones
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,          // required by backend
        joiningDate: formData.joiningDate, // required by backend
        designation: formData.designation, // required by backend
      };

      await updateEmployee(employeeId, updateData);
      toast.success("Profile updated successfully 🎉");
      onSuccess();
      setTimeout(onClose, 800);
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please make sure all required fields are filled.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-base-300 pb-3">
          <h3 className="text-2xl md:text-3xl font-bold text-base-content">Update Profile</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Editable fields */}
              <InputField icon={<FaUser />} label="First Name" value={formData.firstName} onChange={(v) => handleChange("firstName", v)} />
              <InputField icon={<FaUser />} label="Last Name" value={formData.lastName} onChange={(v) => handleChange("lastName", v)} />
              <InputField icon={<FaPhone />} label="Phone Number" value={formData.phoneNumber} onChange={(v) => handleChange("phoneNumber", v)} />
              <SelectField icon={<FaVenusMars />} label="Gender" value={formData.gender} onChange={(v) => handleChange("gender", v)} options={["MALE","FEMALE","OTHER"]} />
              <InputField icon={<FaCalendarAlt />} label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v) => handleChange("dateOfBirth", v)} className="md:col-span-2" />

              {/* Read-only fields */}
              <InputField icon={<FaEnvelope />} label="Email" value={formData.email} disabled />
              <InputField icon={<FaCalendarAlt />} label="Joining Date" type="date" value={formData.joiningDate} disabled />
              <InputField icon={<FaDollarSign />} label="Salary" value={formData.salary} disabled />
              <InputField icon={<FaUser />} label="Designation" value={formData.designation} disabled />
              <InputField icon={<FaBuilding />} label="Department" value={formData.departmentId} disabled />
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-base-300">
              <button type="button" onClick={onClose} className="btn btn-outline w-full md:w-auto">Cancel</button>
              <button type="submit" className="btn btn-primary w-full md:w-auto px-6" disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Input field component
const InputField = ({ icon, label, value, onChange, type = "text", className = "", disabled = false }) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label font-semibold text-base-content/70">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-base-content/40">{icon}</div>
      <input type={type} className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary" value={value} onChange={(e) => onChange && onChange(e.target.value)} disabled={disabled} />
    </div>
  </div>
);

// Select field component
const SelectField = ({ icon, label, value, onChange, options, disabled = false }) => (
  <div className="form-control w-full">
    <label className="label font-semibold text-base-content/70">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-base-content/40">{icon}</div>
      <select className="select select-bordered w-full pl-10 focus:ring-2 focus:ring-primary" value={value} onChange={(e) => onChange && onChange(e.target.value)} disabled={disabled}>
        <option value="">Select {label}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

export default EmployeeUpdateProfileModal;