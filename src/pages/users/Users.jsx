import React, { useState } from "react";
import { Users as UsersIcon, UserPlus } from "lucide-react";
import RegisterForm from "../auth/RegisterForm";
import UserList from "./UserList";

const Users = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="card bg-card shadow-sm rounded-xl  transition-all">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary transition">
              <UsersIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">
                Users Management
              </h2>
              <p className="text-sm text-text/60">
                Create and manage system users
              </p>
            </div>
          </div>

          {/* Create User Button */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 btn bg-primary text-white hover:bg-primary/90 transition-transform transform hover:scale-105"
          >
            <span className="p-1 rounded-full bg-white/20">
              <UserPlus size={16} />
            </span>
            Create User
          </button>
        </div>
      </div>

      {/* User List */}
      <UserList refreshFlag={refreshFlag} />

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg p-0 bg-card rounded-xl shadow-lg transition-all">
            {/* Modal Header */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-200">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <UserPlus size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-text">
                  Create New User
                </h3>
                <p className="text-xs text-text/60">
                  Fill details to create account
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <RegisterForm
                onClose={() => setShowRegisterModal(false)}
                onSuccess={() => {
                  setShowRegisterModal(false);
                  setRefreshFlag(!refreshFlag);
                }}
              />
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => setShowRegisterModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Users;