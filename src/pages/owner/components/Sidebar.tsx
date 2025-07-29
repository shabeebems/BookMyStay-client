import React, { useEffect, useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";

type SidebarProps = {
  active: string;
  changeActive: (title: string) => void;
};

const OwnerSidebar: React.FC<SidebarProps> = ({ active, changeActive }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setOpen(false);
    }
  }, []);

  const menus = [
    { title: 'Dashboard', icon: <MdOutlineDashboard color="#0E4D64" /> },
    { title: 'Profile', icon: <CgProfile color="#0E4D64" /> },
  ];

  return (
    <aside
      className={`${open ? 'w-56 lg:w-72' : 'w-20'} duration-300 h-screen p-5 pt-8 bg-gradient-to-b shadow-xl relative`}
    >
      {/* Logo & Collapse Control */}
      <div className="flex items-center gap-4">
        <img
          src="https://www.shutterstock.com/image-vector/house-logo-template-design-vector-600nw-741515455.jpg"
          alt="Owner Logo"
          onClick={() => window.innerWidth > 640 && setOpen(true)}
          className={`cursor-pointer duration-500 w-14 ${open && 'rotate-[360deg]'}`}
        />
        <h1
          className={`text-blue-900 font-bold text-xl origin-left duration-300 ${!open && 'scale-0'}`}
        >
          Owner
        </h1>
        {open && (
          <IoIosArrowBack
            size={26}
            color="#0E4D64"
            onClick={() => setOpen(false)}
            className="cursor-pointer ml-auto hover:scale-110"
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
              className={`flex items-center gap-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm
                ${menu.title === active
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 shadow-md'
                  : 'hover:bg-blue-50 hover:scale-[1.04] hover:shadow-md'}`}
            >
              {menu.icon}
              {open && (
                <span className="origin-left transition-all duration-200 text-blue-900 text-base font-semibold">
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

export default OwnerSidebar;
