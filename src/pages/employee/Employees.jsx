import React, { useEffect, useState } from "react";
import { getAllEmployees } from "../../service/EmployeeService";
import EmployeeList from "./EmployeeList";
import CreateEmployeeModal from "./CreateEmployeeModal";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import SearchEmployee from "./SearchEmployee";

import toast from "react-hot-toast";
import { Users, Plus } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data || []);
      setFilteredEmployees(res.data || []);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-sm border border-base-200 rounded-xl">
        <div className="card-body flex flex-col md:flex-row md:justify-between gap-4 items-center">
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
            <Plus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Table */}

      {/* Search */}

      <div className="card-body p-4">
        <SearchEmployee
          fullEmployees={employees}
          onSearchResults={setFilteredEmployees}
        />
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
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

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={fetchEmployees}
      />

      {/* View Employee Modal */}
      {viewId && (
        <ViewEmployeeDetails
          employeeId={viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {/* Update Employee Modal */}
      {editId && (
        <UpdateEmployeeModal
          employeeId={editId}
          onClose={() => setEditId(null)}
          onSuccess={fetchEmployees}
        />
      )}

      {/* Delete Employee Modal */}
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
