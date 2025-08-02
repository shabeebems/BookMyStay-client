import React, { useEffect, useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";

type SidebarProps = {
  active: string;
  changeActive: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ active, changeActive }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setOpen(false);
    }
  }, []);

  const menus = [
    { title: 'Dashboard', icon: <MdOutlineDashboard color='#030032' /> },
    { title: 'Notifications', icon: <GrUserWorker color='#030032' /> },
    { title: 'Users', icon: <GrUserWorker color='#030032' /> },
    { title: 'Owners', icon: <GrUserWorker color='#030032' /> },
  ];

  return (
    <aside
      className={`${open ? 'w-56 lg:w-72' : 'w-20'} duration-300 h-screen p-5 pt-8 bg-white shadow-2xl relative`}
    >
      {/* Logo & Collapse Control */}
      <div className="flex items-center gap-4">
        <img
          src="https://www.shutterstock.com/image-vector/house-logo-template-design-vector-600nw-741515455.jpg"
          alt="Logo"
          onClick={() => window.innerWidth > 640 && setOpen(true)}
          className={`cursor-pointer duration-500 w-16 ${open && 'rotate-[360deg]'}`}
        />
        <h1
          className={`text-blue-950 font-medium text-xl origin-left duration-300 ${!open && 'scale-0'}`}
        >
          Admin
        </h1>
        {open && (
          <FaPersonWalkingArrowRight
            size={30}
            color='#030032'
            onClick={() => setOpen(false)}
            className="cursor-pointer ml-auto"
          />
        )}
      </div>

      {/* Sidebar Menu */}
      <nav className="pt-6">
        <ul className="space-y-3">
          {menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => changeActive(menu.title)}
              className={`flex items-center gap-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-md bg-white
                ${menu.title === active
                  ? 'bg-gradient-to-r from-white to-gray-200 shadow-lg'
                  : 'hover:bg-gray-100 hover:scale-[1.05] hover:shadow-lg'}
              `}
            >
              {menu.icon}
              {open && (
                <span className="origin-left transition-all duration-200 text-indigo-950 text-base font-semibold">
                  {menu.title}
                </span>
              )}
            </li>

          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
