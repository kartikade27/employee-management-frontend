import React, { useContext, useEffect, useState } from "react";
import { getAllEmployees } from "../../service/EmployeeService";
import EmployeeList from "./EmployeeList";
import CreateEmployeeModal from "./CreateEmployeeModal";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import SearchEmployee from "./SearchEmployee";

import toast from "react-hot-toast";
import { Users, Plus } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const [openCreate, setOpenCreate] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();

      const data = res.data || [];

      setEmployees(data);
      setFilteredEmployees(data);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Employees Management</h2>
              <p className="text-sm opacity-70">Manage all employees</p>
            </div>
          </div>

          <button
            className="btn btn-primary gap-2 w-full sm:w-auto"
            onClick={() => setOpenCreate(true)}
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employees Section */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body space-y-4">
          {/* Search */}
          <SearchEmployee
            fullEmployees={employees}
            onSearchResults={setFilteredEmployees}
          />

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              onView={(id) => setViewId(id)}
              onEdit={(id) => setEditId(id)}
              onDelete={(emp) => setDeleteData(emp)}
            />
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={fetchEmployees}
      />

      {/* View Employee */}
      {viewId && (
        <ViewEmployeeDetails
          employeeId={viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {/* Update Employee */}
      {editId && (
        <UpdateEmployeeModal
          employeeId={editId}
          onClose={() => setEditId(null)}
          onSuccess={fetchEmployees}
          userRole={user.role}
        />
      )}

      {/* Delete Employee */}
      {deleteData && (
        <DeleteEmployeeModal
          open={true}
          employeeId={deleteData.employeeId}
          employeeName={`${deleteData.firstName} ${deleteData.lastName}`}
          onClose={() => setDeleteData(null)}
          onDeleted={fetchEmployees}
        />
      )}
    </div>
  );
};

export default Employees;
