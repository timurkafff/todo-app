import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaMoon, FaSun, FaUser, FaTachometerAlt, FaTasks, FaCheckCircle, FaPlus } from "react-icons/fa";
import { SlMagnifier } from "react-icons/sl";
import { taskStore } from "../../stores/TaskStore";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
  { name: "All Tasks", icon: <FaTasks />, path: "/all-tasks" },
  { name: "Completed Tasks", icon: <FaCheckCircle />, path: "/all-completed-tasks" },
  { name: "Add A Task", icon: <FaPlus />, path: "/add-task" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    taskStore.searchTasks(value);
  };

  return (
    <>
      {/* Выезжающее меню */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#006D77] shadow-lg z-40 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center h-16 px-6 border-b">
          <span className="font-bold text-lg text-[#FFDDD2]">Menu</span>
        </div>
        <ul className="mt-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="w-full flex items-center text-left px-6 py-3 text-[#FFDDD2] hover:bg-[#484b4b] transition"
                onClick={() => setOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Оверлей для закрытия меню */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-[#ffffff11] bg-opacity-30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <header
        className="relative flex items-center px-4 h-16"
        style={{ background: "#83C5BE" }}
      >
        {/* бургер */}
        <div className="flex items-center flex-shrink-0">
          <button
            className="text-2xl text-[#006D77] focus:outline-none cursor-pointer"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>

        {/* поиск */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="write you project name"
              value={query}
              onChange={handleSearch}
              className="w-[286px] px-3 py-2 pr-10 rounded-md bg-[#FFDDD2] text-base focus:outline-none"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-[#006D77]">
              <SlMagnifier />
            </span>
          </div>
        </div>

        {/* иконки */}
        <div className="flex items-center flex-shrink-0 ml-auto space-x-4">
          <button className="text-xl text-[#006D77]">
            <FaBell />
          </button>
          <button
            className="text-xl cursor-pointer text-[#006D77]"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
          <button className="text-xl text-[#006D77]">
            <FaUser />
          </button>
        </div>
      </header>
    </>
  );
}