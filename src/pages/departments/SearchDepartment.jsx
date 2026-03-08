import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { searchDepartment } from "../../service/DepartmentService";

const SearchDepartment = ({ onResults }) => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter department name");
      return;
    }

    const toastId = toast.loading("Searching department...");
    try {
      setLoading(true);
      const res = await searchDepartment(keyword);
      onResults(res.data || []);
      toast.success("Search completed", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Search failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-card shadow rounded-xl border border-gray-200 transition-all">
      <div className="card-body">
        <h2 className="card-title text-lg text-text">Search Department</h2>
        <form onSubmit={handleSearch} className="flex gap-3 mt-2">
          <input
            type="text"
            placeholder="Search department name..."
            className="input input-bordered w-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="btn bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <FaSearch />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchDepartment;
