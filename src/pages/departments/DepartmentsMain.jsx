import React, { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import toast from "react-hot-toast";

import DepartmentList from "./DepartmentList";
import CreateDepartmentModal from "./CreateDepartmentModal";
import { getAllDepartments } from "../../service/DepartmentService";

const DepartmentsMain = () => {

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchDepartments = async () => {

    try {

      setLoading(true);

      const res = await getAllDepartments();

      setDepartments(res.data || []);

    } catch {

      toast.error("Failed to load departments");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="card bg-base-100 shadow border border-base-200">

        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Building2 size={22} />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Departments
              </h2>

              <p className="text-sm text-base-content/60">
                Manage organization departments
              </p>

            </div>

          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={16} />
            Add Department
          </button>

        </div>

      </div>

      {/* Department List */}



          <DepartmentList
            departments={departments}
            loading={loading}
            refreshDepartments={fetchDepartments}
          />



      {/* Create Modal */}

      <CreateDepartmentModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={fetchDepartments}
      />

    </div>

  );

};

export default DepartmentsMain;