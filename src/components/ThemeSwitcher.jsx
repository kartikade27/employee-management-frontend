export default function ThemeSwitcher() {
  const themes = [
    { name: "corporate", icon: "💼" },
    { name: "emerald", icon: "🌿" },
    { name: "dark", icon: "🌙" },
    { name: "winter", icon: "🧊" },
    { name: "coffee", icon: "☕" },
    { name: "night", icon: "🌃" },
  ];

  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} className="btn btn-ghost">
        Theme
      </div>

      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44">
        {themes.map((theme) => (
          <li key={theme.name}>
            <button onClick={() => changeTheme(theme.name)}>
              {theme.icon} {theme.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
