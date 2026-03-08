import React, { useState } from "react";
import { registerUser } from "../../service/authService";
import { FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const RegisterForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password.trim()) newErrors.password = "Password required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    const toastId = toast.loading("Creating user...");
    try {
      setLoading(true);
      await registerUser(formData);
      toast.success("User created successfully!", { id: toastId });
      setFormData({ username: "", email: "", password: "", role: "EMPLOYEE" });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username */}
      <div className="form-control w-full">
        <label className="label font-medium">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          className={`input input-bordered w-full ${
            errors.username ? "input-error" : ""
          }`}
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        {errors.username && (
          <span className="text-error text-sm">{errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="form-control w-full">
        <label className="label font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          className={`input input-bordered w-full ${
            errors.email ? "input-error" : ""
          }`}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && (
          <span className="text-error text-sm">{errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-control w-full">
        <label className="label font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className={`input input-bordered w-full ${
            errors.password ? "input-error" : ""
          }`}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && (
          <span className="text-error text-sm">{errors.password}</span>
        )}
      </div>

      {/* Role */}
      <div className="form-control w-full">
        <label className="label font-medium">User Role</label>
        <select
          className="select select-bordered w-full"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="HR">HR Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline flex-1"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn bg-primary text-white flex-1 flex items-center justify-center gap-2"
        >
          <FaUserPlus />
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
