import React, { useEffect, useState, useContext } from "react";
import {
  getDocumentsByEmployee,
  deleteDocument,
  downloadDocument,
} from "../../service/documentService";
import { getAllEmployees } from "../../service/EmployeeService";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 5;

const DocumentsByEmployee = () => {
  const { user, getLoggedEmployeeId } = useContext(AuthContext);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDocuments = async () => {
    setLoading(true);

    try {
      let allDocuments = [];

      if (user.role === "EMPLOYEE") {
        const res = await getDocumentsByEmployee(getLoggedEmployeeId());
        allDocuments = res.data || [];
      } else {
        const empRes = await getAllEmployees();

        for (const emp of empRes.data) {
          try {
            const docRes = await getDocumentsByEmployee(emp.employeeId);
            allDocuments = [...allDocuments, ...(docRes.data || [])];
          } catch {}
        }
      }

      allDocuments.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
      );

      setDocuments(allDocuments);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleDelete = async () => {
    if (!selectedDoc) return;

    try {
      await deleteDocument(selectedDoc.documentId);

      toast.success("Document deleted successfully!");

      setDocuments((prev) =>
        prev.filter((d) => d.documentId !== selectedDoc.documentId),
      );
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleteModalOpen(false);
      setSelectedDoc(null);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      const res = await downloadDocument(documentId, getLoggedEmployeeId());
      window.open(res.data.filePath, "_blank");
    } catch {
      toast.error("Failed to download document");
    }
  };

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedDocs = documents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!documents.length) {
    return (
      <p className="text-center py-6 text-base-content/50">
        No documents found
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Uploaded</th>

              {(user.role === "HR" || user.role === "ADMIN") && (
                <th className="px-4 py-2">Employee</th>
              )}

              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedDocs.map((doc) => (
              <tr
                key={doc.documentId}
                className="bg-card hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{doc.documentName}</td>

                <td className="px-4 py-3">{doc.documentType}</td>

                <td className="px-4 py-3">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </td>

                {(user.role === "HR" || user.role === "ADMIN") && (
                  <td className="px-4 py-3">{doc.employeeName}</td>
                )}

                <td className="px-4 py-3 text-center">
                  {user.role === "EMPLOYEE" && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDownload(doc.documentId)}
                    >
                      Download
                    </button>
                  )}

                  {(user.role === "HR" || user.role === "ADMIN") && (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}

      <div className="grid gap-4 md:hidden">
        {paginatedDocs.map((doc) => (
          <div
            key={doc.documentId}
            className="card bg-card shadow-md rounded-xl p-4 hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            <h3 className="font-semibold text-text">{doc.documentName}</h3>

            <p className="text-sm text-text/70 mt-1">
              Type: {doc.documentType}
            </p>

            <p className="text-sm text-text/70">
              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>

            {(user.role === "HR" || user.role === "ADMIN") && (
              <p className="text-sm text-text/70">
                Employee: {doc.employeeName}
              </p>
            )}

            <div className="mt-3">
              {user.role === "EMPLOYEE" && (
                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => handleDownload(doc.documentId)}
                >
                  Download
                </button>
              )}

              {(user.role === "HR" || user.role === "ADMIN") && (
                <button
                  className="btn btn-error btn-sm w-full"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1
                  ? "btn-primary text-white"
                  : "btn-outline text-text"
              } hover:scale-105`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Modal */}

      {deleteModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-base-100 p-6 rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Delete Document</h3>

              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setDeleteModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedDoc.documentName}</span>?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Delete
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsByEmployee;
