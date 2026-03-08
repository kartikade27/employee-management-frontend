import axiosInstance from "../api/axiosConfig";

export const uploadDocument = (formData) =>
  axiosInstance.post("/documents/uploadDocument", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDocumentsByEmployee = (employeeId) =>
  axiosInstance.get(`/documents/getDocumentsByEmployee/${employeeId}`);

export const getDocumentsByType = (documentType) =>
  axiosInstance.get("/documents/getDocumentByType", {
    params: { documentType: documentType },
  });

export const deleteDocument = (documentId) =>
  axiosInstance.delete(`/documents/deleteDocument/${documentId}`);

export const downloadDocument = (documentId, employeeId) =>
  axiosInstance.get(`/documents/downloadDocument/${documentId}/${employeeId}`);
