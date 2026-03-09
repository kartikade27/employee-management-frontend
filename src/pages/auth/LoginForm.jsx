import React, { useState, useContext } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);

        const response = await login({ email, password });

        toast.success("Login successful");

        if (response.role === "ADMIN") navigate("/admin");
        else if (response.role === "HR") navigate("/hr");
        else if (response.role === "EMPLOYEE") navigate("/employee");
      } catch (error) {
        const message =
          error.response?.data?.message || "Invalid username or password";

        setApiError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EMS SYSTEM</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to continue</p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="alert alert-error mb-4">
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-gray-600">
                Email
              </span>
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />

              <input
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-800 ${
                  errors.email ? "input-error" : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-gray-600">
                Password
              </span>
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-800 ${
                  errors.password ? "input-error" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-full bg-gray-900 text-white hover:bg-black border-none"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
