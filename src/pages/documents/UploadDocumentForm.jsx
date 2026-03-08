import React, { useState, useEffect } from "react";
import { uploadDocument } from "../../service/documentService";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";

const UploadDocumentForm = ({ onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data || []);

        if (res.data?.length > 0) {
          setSelectedEmployee(res.data[0].employeeId);
        }
      } catch {
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !file || !documentName) {
      return toast.error("All fields are required!");
    }

    const formData = new FormData();
    formData.append("employeeId", selectedEmployee);
    formData.append("documentName", documentName);
    formData.append("file", file);

    setLoading(true);

    try {
      await uploadDocument(formData);

      toast.success("Document uploaded successfully!");

      setDocumentName("");
      setFile(null);

      if (onClose) onClose();
    } catch {
      toast.error("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Employee */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Employee</span>
        </label>

        <select
          className="select select-bordered w-full"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.firstName} {emp.lastName} ({emp.employeeId})
            </option>
          ))}
        </select>
      </div>

      {/* Document Name */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Document Name</span>
        </label>

        <input
          type="text"
          placeholder="Enter document name"
          className="input input-bordered w-full"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Upload File</span>
        </label>

        <input
          type="file"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Cancel
        </button>

        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </form>
  );
};

export default UploadDocumentForm;
