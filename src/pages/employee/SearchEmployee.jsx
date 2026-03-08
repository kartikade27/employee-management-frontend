import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchEmployee = ({ onSearchResults, fullEmployees }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm.trim()) return onSearchResults(fullEmployees);

    const filtered = fullEmployees.filter((emp) =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    onSearchResults(filtered);
  }, [searchTerm, fullEmployees]);

  return (
    <div className=" bg-card border border-base-300">
      <div className="card-body">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-3 opacity-60" />
          <input
            type="text"
            placeholder="Search employee..."
            className="input input-bordered w-full pl-9 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchEmployee;
