// src/components/employee/EmployeeUpdateProfileModal.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEmployeeById, updateEmployee } from "../../service/EmployeeService";
import { FaUser, FaPhone, FaCalendarAlt, FaVenusMars } from "react-icons/fa";

const EmployeeUpdateProfileModal = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(employeeId);
        const emp = res.data;
        setFormData({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          phoneNumber: emp.phoneNumber || "",
          gender: emp.gender || "",
          dateOfBirth: emp.dateOfBirth || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [employeeId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateEmployee(employeeId, formData);
      toast.success("Profile updated successfully 🎉");
      onSuccess();
      setTimeout(onClose, 800);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] animate-fadeIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-base-300 pb-3">
          <h3 className="text-2xl md:text-3xl font-bold text-base-content">
            Update Profile
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={<FaUser />}
                label="First Name"
                value={formData.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
              <InputField
                icon={<FaUser />}
                label="Last Name"
                value={formData.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
              <InputField
                icon={<FaPhone />}
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(v) => handleChange("phoneNumber", v)}
              />
              <SelectField
                icon={<FaVenusMars />}
                label="Gender"
                value={formData.gender}
                onChange={(v) => handleChange("gender", v)}
                options={["MALE", "FEMALE", "OTHER"]}
              />
              <InputField
                icon={<FaCalendarAlt />}
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(v) => handleChange("dateOfBirth", v)}
                className="md:col-span-2"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-base-300">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto px-6"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ===== Input Field Component =====
const InputField = ({
  icon,
  label,
  value,
  onChange,
  type = "text",
  className = "",
}) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label font-semibold text-base-content/70">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-base-content/40">{icon}</div>
      <input
        type={type}
        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

// ===== Select Field Component =====
const SelectField = ({ icon, label, value, onChange, options }) => (
  <div className="form-control w-full">
    <label className="label font-semibold text-base-content/70">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-base-content/40">{icon}</div>
      <select
        className="select select-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default EmployeeUpdateProfileModal;
