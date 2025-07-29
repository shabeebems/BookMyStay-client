import React, { useEffect, useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  active: string;
  changeActive: (title: string) => void;
};

const UserSidebar: React.FC<SidebarProps> = ({ active, changeActive }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 640) {
      setOpen(false);
    }
  }, []);

  const menus = [
    { title: 'Dashboard', icon: <MdOutlineDashboard size={22} /> },
    { title: 'Profile', icon: <CgProfile size={22} /> },
  ];

  return (
    <aside
      className={`${
        open ? 'w-56 lg:w-72' : 'w-20'
      } duration-300 h-screen p-4 pt-6 bg-white/30 backdrop-blur-md shadow-xl relative border-r border-gray-200 flex flex-col justify-between`}
    >
      <div>
        {/* Logo & Collapse Control */}
        <div className="flex items-center gap-4">
          <img
            src="https://www.shutterstock.com/image-vector/house-logo-template-design-vector-600nw-741515455.jpg"
            alt="Owner Logo"
            onClick={() => window.innerWidth > 640 && setOpen(true)}
            className={`cursor-pointer w-12 rounded-xl transition-transform duration-500 ${open && 'rotate-[360deg]'}`}
          />
          <h1
            className={`text-blue-950 font-bold text-xl origin-left transition-all duration-300 ${!open && 'opacity-0 scale-0'}`}
          >
            User
          </h1>
          {open && (
            <IoIosArrowBack
              size={24}
              color="#0E4D64"
              onClick={() => setOpen(false)}
              className="cursor-pointer ml-auto hover:scale-110 transition-transform"
            />
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="pt-8">
          <ul className="space-y-3">
            {menus.map((menu, index) => (
              <li
                key={index}
                onClick={() => changeActive(menu.title)}
                className={`flex items-center gap-x-4 px-4 py-3 rounded-full cursor-pointer transition-all duration-300
                  ${
                    menu.title === active
                      ? 'bg-blue-100 shadow-inner scale-105 text-blue-950'
                      : 'hover:bg-blue-50 hover:scale-105 hover:shadow-sm text-gray-700'
                  }`}
              >
                <div
                  className={`p-2 rounded-full transition-colors ${
                    menu.title === active ? 'bg-blue-200' : 'bg-gray-100'
                  }`}
                >
                  {menu.icon}
                </div>
                {open && (
                  <span className="text-base font-medium">
                    {menu.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Go to Home Link */}
      <div
        onClick={() => navigate('/')}
        className={`flex items-center gap-x-4 px-4 py-3 mb-4 rounded-full cursor-pointer transition-all duration-300 
          hover:bg-blue-50 hover:scale-105 hover:shadow-md text-gray-700`}
      >
        <div className="p-2 bg-gray-100 rounded-full">
          <IoHomeOutline size={22} />
        </div>
        {open && (
          <span className="text-base font-medium text-blue-900">
            Go to Home
          </span>
        )}
      </div>
    </aside>
  );
};

export default UserSidebar;
