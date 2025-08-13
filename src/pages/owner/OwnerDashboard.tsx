import { useCallback, useState } from "react";
import OwnerSidebar from "./components/Sidebar";
import ProfilePage from "../../components/Profile";
import Navbar from "../../components/Navbar";
import NotificationList from "./pages/Notification";
import HotelsList from "./pages/Hotels";

const OwnerDashboard = () => {
  const [active, setActive] = useState<string>("Dashboard");

  const changeActive = useCallback((selected: string) => {
    setActive(selected);
  }, []);

  return (
    <div className="flex">
  <OwnerSidebar active={active} changeActive={changeActive} isVerified={true} />

  <div className="flex-1 flex flex-col max-h-screen overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      <Navbar role={"Owner"} />
    </div>

    <div className="p-6 pb-12 space-y-6">
      {active === "Dashboard" && <h1>Dashboard</h1>}
      {active === "Profile" && <ProfilePage />}
      {active === "Notification" && <NotificationList />}
      {active === "Hotels" && <HotelsList />}
    </div>
  </div>
</div>

  );
};

export default OwnerDashboard;
