import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-40 h-16 bg-base-100 border-b border-base-200 px-4 sm:px-6 flex items-center justify-between">
      {/* LEFT SIDE: Sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <FaBars size={18} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-primary">
          EMS Dashboard
        </h1>
      </div>

      {/* RIGHT SIDE: Theme + User */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="avatar cursor-pointer">
            <div className="w-9 sm:w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-200"
          >
            <div className="px-3 py-2 border-b border-base-200 mb-2">
              <p className="text-xs opacity-60">{user?.role}</p>
              <p className="font-semibold">{user?.name}</p>
            </div>

            {user?.role === "EMPLOYEE" && (
              <li>
                <Link to="profile">Profile</Link>
              </li>
            )}

            <li>
              <button onClick={logout} className="text-error cursor-pointer">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
