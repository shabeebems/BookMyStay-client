import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiLogOut } from "react-icons/bi";
import { logoutRequest } from "../hooks/api";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { User, Crown, Shield } from "lucide-react";

type NavbarProps = {
  role: string;
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logoutRequest("/auth/logout");
    localStorage.removeItem("token");
    navigate(`/login/${role.toLowerCase()}`);
  };

  const confirmLogout = () => {
    handleLogout();
    setOpen(false);
  };

  const getRoleIcon = () => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case "owner":
        return <Shield className="w-5 h-5 text-emerald-400" />;
      default:
        return <User className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRoleGradient = () => {
    switch (role.toLowerCase()) {
      case "admin":
        return "from-yellow-500 to-orange-500";
      case "owner":
        return "from-emerald-500 to-teal-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
        className="relative flex items-center justify-between px-6 h-20 shadow-2xl overflow-hidden
          bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
          backdrop-blur-xl border-b border-slate-700/50"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        </div>

        {/* Left: Role */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative flex items-center gap-3 z-10"
        >
          <div className="relative">
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${getRoleGradient()} rounded-lg blur opacity-30 animate-pulse`}
            ></div>
            <div className="relative bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 backdrop-blur-sm">
              {getRoleIcon()}
            </div>
          </div>

          <div>
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className={`font-bold text-xl tracking-wide drop-shadow-lg bg-gradient-to-r ${getRoleGradient()} bg-clip-text text-transparent`}
            >
              {role} Dashboard
            </motion.h1>
            <p className="text-slate-400 text-xs font-medium">Management Portal</p>
          </div>
        </motion.div>

        {/* Right: User info + Logout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative flex items-center gap-4 z-10"
        >
          <div className="hidden md:block text-right">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="block text-white font-semibold text-lg drop-shadow-sm"
            >
              Shabeeb
            </motion.span>
            <p className="text-slate-400 text-xs font-medium">Online</p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-75"></div>
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
              alt="User Avatar"
              className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
          </div>

          {/* Logout Button */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-white/10 p-2 rounded-full backdrop-blur-sm hover:bg-red-500/20 transition-colors"
            onClick={() => setOpen(true)}
          >
            <BiLogOut size={20} className="text-red-400" />
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {open && (
          <ConfirmDialog
            open={open}
            title="Are you sure?"
            message="Do you want to logout from your account?"
            onConfirm={confirmLogout}
            onCancel={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
