import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DocumentsByEmployee from "./DocumentsByEmployee";
import DocumentsByType from "./DocumentsByType";
import UploadDocumentForm from "./UploadDocumentForm";
import { Filter } from "lucide-react";

const DocumentsDashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card bg-base-100 shadow-sm border border-base-200 rounded-xl">
        <div className="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">📄</div>
            <div>
              <h2 className="text-xl font-semibold">Documents Dashboard</h2>
              <p className="text-sm text-base-content/60">
                Manage employee documents
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {(user?.role === "HR" || user?.role === "ADMIN") && (
              <button
                className="btn btn-outline flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            )}
            {(user?.role === "HR" || user?.role === "ADMIN") && (
              <button
                className="btn btn-primary"
                onClick={() => setOpenUploadModal(true)}
              >
                Upload Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {openUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-base-100 dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setOpenUploadModal(false)}
              >
                ✕
              </button>
            </div>
            <UploadDocumentForm onClose={() => setOpenUploadModal(false)} />
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (user?.role === "HR" || user?.role === "ADMIN") && (
        <div className="card bg-base-100 shadow border border-base-200 rounded-xl">
          <div className="card-body flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="font-semibold md:w-40 text-gray-700 dark:text-gray-200">
              Document Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select select-bordered w-full sm:w-64 bg-base-100 text-base-content dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">All Types</option>
              <option value="Employment">Employment</option>
              <option value="Identity Proof">Identity Proof</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Documents By Type */}
      {selectedType && (user?.role === "HR" || user?.role === "ADMIN") && (
        <div className="card bg-base-100 shadow border border-base-200 rounded-xl">
          <div className="card-body p-4">
            <DocumentsByType type={selectedType} />
          </div>
        </div>
      )}

      {/* Documents By Employee */}
     
        <div className="card-body p-4">
          {user ? (
            <DocumentsByEmployee />
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-300">
              No user logged in
            </p>
          )}
        </div>
    </div>
  );
};

export default DocumentsDashboard;
