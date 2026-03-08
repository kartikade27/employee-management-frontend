import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  activateUser,
  deactivateUser,
} from "../../service/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

const UserList = ({ refreshFlag }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [refreshFlag]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      const sortedUsers = (res.data || []).sort((a, b) => {
        if (a.role === "ADMIN") return -1;
        if (b.role === "ADMIN") return 1;
        return a.username.localeCompare(b.username);
      });
      setUsers(sortedUsers);
      setCurrentPage(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (user) => {
    try {
      setActionLoading(user.userId);
      user.isActive
        ? await deactivateUser(user.userId)
        : await activateUser(user.userId);
      toast.success("Status updated");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full rounded-xl border border-gray-200 text-text">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                className="bg-card hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="badge badge-outline">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-error">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(user)}
                    disabled={actionLoading === user.userId}
                    className={`btn btn-sm transition-transform transform hover:scale-105 ${
                      user.isActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-success text-white hover:bg-success/90"
                    }`}
                  >
                    {actionLoading === user.userId ? (
                      "..."
                    ) : user.isActive ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {paginatedUsers.map((user) => (
          <div
            key={user.userId}
            className="card bg-card shadow-md rounded-xl p-4 hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-text">{user.username}</h3>
                <p className="text-sm text-text/60">{user.email}</p>
              </div>
              <button
                onClick={() => handleToggle(user)}
                disabled={actionLoading === user.userId}
                className={`btn btn-sm flex items-center gap-1 ${
                  user.isActive
                    ? "bg-primary text-white"
                    : "bg-success text-white"
                } hover:scale-105`}
              >
                {user.isActive ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="badge badge-outline">{user.role}</span>
              {user.isActive ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-error">Inactive</span>
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
    </div>
  );
};

export default UserList;
