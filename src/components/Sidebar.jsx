import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import linksByRole from "./linksByRole";

export default function Sidebar({
  sidebarOpen,
  role,
  collapsed,
  closeSidebar,
}) {
  const menu = linksByRole[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-base-100 border-r border-base-200 shadow-lg transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-base-200">
          {!collapsed ? (
            <span className="font-semibold text-base">EMS SYSTEM</span>
          ) : (
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              E
            </div>
          )}

          {/* Close button for mobile */}
          <button
            className="lg:hidden btn btn-ghost btn-sm"
            onClick={closeSidebar}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <ul className="menu p-3 space-y-5 mt-4">
          {menu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg transition-all duration-200
                  ${isActive ? "bg-primary text-white" : "hover:bg-base-200"}`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}