import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import GenerateSalary from "./GenerateSalary";
import SalaryByEmployee from "./SalaryByEmployee";
import { FaDollarSign, FaPlus, FaHistory } from "react-icons/fa";

const SalaryDashboard = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  const [refreshSalary, setRefreshSalary] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Card */}

      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              {role === "EMPLOYEE" ? (
                <FaHistory size={22} />
              ) : (
                <FaDollarSign size={22} />
              )}
            </div>

            <div>
              {role === "EMPLOYEE" ? (
                <>
                  <h2 className="text-xl font-semibold">Salary History</h2>
                  <p className="text-sm text-base-content/60">
                    View your salary payment history
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Salary Dashboard</h2>
                  <p className="text-sm text-base-content/60">
                    Generate and manage employee salaries
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Generate button only HR / ADMIN */}

          {(role === "HR" || role === "ADMIN") && (
            <button
              className="btn btn-primary gap-2"
              onClick={() => setOpenModal(true)}
            >
              <FaPlus />
              Generate Salary
            </button>
          )}
        </div>
      </div>

      {/* Modal */}

      {openModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg p-0 rounded-xl">
            {/* Header */}

            <div className="flex items-center justify-between gap-3 p-5 border-b border-base-200">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FaDollarSign size={18} />
              </div>

              <div>
                <h3 className="font-semibold">Generate Salary</h3>
                <p className="text-xs text-base-content/60">
                  Fill the form to generate salary for employee
                </p>
              </div>

              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setOpenModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Body */}

            <div className="p-6">
              <GenerateSalary
                onSuccess={() => {
                  setRefreshSalary((prev) => !prev);
                  setOpenModal(false);
                }}
                refreshTrigger={refreshSalary}
              />
            </div>
          </div>

          <div className="modal-backdrop" onClick={() => setOpenModal(false)} />
        </div>
      )}

      {/* Salary Table */}

     
        <div className="card-body p-4 md:p-6">
          <SalaryByEmployee refreshTrigger={refreshSalary} />
        </div>
    </div>
  );
};

export default SalaryDashboard;
