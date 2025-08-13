import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Bell, 
  User, 
  ChevronLeft,
  Sparkles,
  Shield,
  Crown
} from 'lucide-react';

type SidebarProps = {
  active: string;
  changeActive: (title: string) => void;
  isVerified: boolean;
};

const OwnerSidebar: React.FC<SidebarProps> = ({ active, changeActive, isVerified }) => {
  const [open, setOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setOpen(false);
    }
  }, []);

  const menus = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      badge: null,
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-400 to-teal-400'
    },
    { 
      title: 'Hotels', 
      icon: Building2, 
      badge: '12',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400'
    },
    { 
      title: 'Notification', 
      icon: Bell, 
      badge: '3',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-400 to-pink-400'
    },
    { 
      title: 'Profile', 
      icon: User, 
      badge: null,
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-400 to-red-400'
    },
  ];

  return (
    <aside
      className={`
        ${open ? 'w-72' : 'w-20'}
        h-screen p-5 pt-6 relative
        transition-all duration-700 ease-in-out
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        backdrop-blur-xl shadow-2xl border-r border-slate-700/50
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-600/5 before:to-purple-600/5
        before:backdrop-blur-sm before:rounded-r-3xl
      `}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-r-3xl">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 -right-2 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Logo & Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
            <img
              src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"
              alt="BookMyStay Logo"
              className={`relative cursor-pointer duration-700 w-14 h-14 rounded-full shadow-lg object-cover ring-2 ring-white/20
                ${open && 'rotate-[360deg]'} hover:scale-110 transition-all`}
              onClick={() => setOpen(true)}
            />
            {isVerified && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-1 shadow-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className={`origin-left duration-500 ${!open && 'scale-0'}`}>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BookMyStay
              </h1>
            </div>
            <p className="text-slate-400 text-xs font-medium">Owner Dashboard</p>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setOpen(!open)}
            className={`absolute -right-3 top-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-purple-600 
              rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-20
              ${!open && 'rotate-180'}`}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 space-y-2">
        {menus.map((menu, index) => {
          const isDisabled = menu.title !== 'Dashboard' && menu.title !== 'Notification' && !isVerified;
          const isActive = menu.title === active && !isDisabled;
          const isHovered = hoveredItem === menu.title;
          const IconComponent = menu.icon;

          return (
            <div key={index} className="relative group">
              {/* Tooltip for collapsed state */}
              {!open && (
                <div className={`absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm
                  opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-xl
                  border border-slate-700 whitespace-nowrap`}>
                  {menu.title}
                </div>
              )}

              <div
                onMouseEnter={() => setHoveredItem(menu.title)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  if (!isDisabled) changeActive(menu.title);
                }}
                className={`
                  relative flex items-center gap-4 p-4 rounded-xl cursor-pointer
                  transition-all duration-300 overflow-hidden group
                  ${isActive
                    ? `bg-gradient-to-r ${menu.gradient} shadow-2xl scale-[1.02] text-white before:absolute before:inset-0 before:bg-white/10 before:backdrop-blur-sm`
                    : 'hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:scale-[1.02] hover:shadow-xl text-slate-300 hover:text-white'}
                  ${isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none'}
                `}
              >
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full shadow-lg"></div>
                )}

                {/* Hover glow effect */}
                {(isHovered || isActive) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${menu.hoverGradient} opacity-10 blur-xl`}></div>
                )}

                {/* Icon with animation */}
                <div className="relative flex items-center justify-center">
                  <div className={`transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                    <IconComponent 
                      size={22} 
                      className={`transition-colors duration-300 ${
                        isActive ? 'text-white drop-shadow-lg' : 'text-slate-300 group-hover:text-white'
                      }`}
                    />
                  </div>
                  
                  {/* Sparkle effect on hover */}
                  {isHovered && !isDisabled && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-ping" />
                  )}
                </div>

                {/* Menu title and badge */}
                {open && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className={`font-semibold transition-all duration-200 truncate
                      ${isActive ? 'text-white drop-shadow-sm' : 'text-slate-300 group-hover:text-white'}`}>
                      {menu.title}
                    </span>
                  </div>
                )}

                {/* Disabled overlay */}
                {isDisabled && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {open && (
                      <span className="text-xs text-slate-400 font-medium">Verify Account</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Status Indicator */}
      <div className={`absolute bottom-6 transition-all duration-500 ${open ? 'left-6 right-6' : 'left-4 right-4'}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isVerified ? 'bg-green-400' : 'bg-orange-400'}`}></div>
            {open && (
              <span className="text-xs text-slate-400 font-medium">
                {isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OwnerSidebar;