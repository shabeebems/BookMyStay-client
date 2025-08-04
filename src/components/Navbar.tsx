import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { logoutRequest } from "../hooks/api";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";  // <-- Import ConfirmDialog

type NavbarProps = {
  role: string;
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);  // <-- Dialog open state

  const handleLogout = async () => {
    await logoutRequest("/auth/logout");
    localStorage.removeItem("token");
    navigate(`/login/${role.toLowerCase()}`);
  };

  const confirmLogout = () => {
    handleLogout();
    setOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between p-5 bg-white shadow-md h-16">
        <h1 className="text-xl font-semibold text-blue-950">{role}</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-950 font-medium hidden md:block">Shabeeb</span>
            <BiLogOut
              onClick={() => setOpen(true)}  // <-- Open confirmation dialog
              color="#030032"
              size={20}
              className="cursor-pointer"
            />
          </div>
        </div>
      </nav>

      <ConfirmDialog
        open={open}
        title="Are you sure?"
        message="Do you want to logout from your account?"
        onConfirm={confirmLogout}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default Navbar;
