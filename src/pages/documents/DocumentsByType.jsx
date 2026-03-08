import React, { useEffect, useState } from "react";
import { getDocumentsByType } from "../../service/documentService";
import toast from "react-hot-toast";

const PAGE_SIZE = 5;

const DocumentsByType = ({ type }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!type) return;
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await getDocumentsByType(type);
        setDocuments(res.data || []);
        setCurrentPage(1);
      } catch {
        toast.error("Failed to fetch documents by type");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [type]);

  const totalPages = Math.ceil(documents.length / PAGE_SIZE);
  const paginatedDocs = documents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (loading)
    return (
      <p className="text-center py-4 text-base-content/50">
        Loading documents...
      </p>
    );
  if (!documents.length)
    return (
      <p className="text-center py-4 text-base-content/50">
        No documents found
      </p>
    );

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow border border-base-200">
        <table className="table-auto w-full text-left">
          <thead className="bg-base-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Uploaded</th>
              <th className="px-4 py-2">Employee</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocs.map((doc) => (
              <tr
                key={doc.documentId}
                className="hover:bg-primary/10 transition-colors"
              >
                <td className="px-4 py-2">{doc.documentName}</td>
                <td className="px-4 py-2">{doc.documentType}</td>
                <td className="px-4 py-2">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{doc.employeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginatedDocs.map((doc) => (
          <div
            key={doc.documentId}
            className="card bg-base-100 shadow-md rounded-xl p-4"
          >
            <div className="font-semibold">{doc.documentName}</div>
            <div className="text-sm text-base-content/60">
              Type: {doc.documentType}
            </div>
            <div className="text-sm text-base-content/60">
              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-base-content/60">
              Employee: {doc.employeeName}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentsByType;
