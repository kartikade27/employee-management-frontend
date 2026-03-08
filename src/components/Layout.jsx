import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("employee-system-2"); // default theme

  // Load saved theme from localStorage or use default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "employee-system-2";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen flex bg-base-100 text-base-content">

      {/* Sidebar */}
      <Sidebar
        role={user?.role}
        sidebarOpen={sidebarOpen}
        collapsed={collapsed}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          theme={theme}
          changeTheme={changeTheme}
        />

        <main className="pt-20 p-6 flex-1">
          <div className="grid gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}