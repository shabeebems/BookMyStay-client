import { useCallback, useState } from "react"
import Sidebar from "./components/Sidebar"
import UsersList from "./pages/UsersList"
import OwnersList from "./pages/OwnersList"
import Navbar from "../../components/Navbar"
import NotificationList from "./components/NotificationList"
import ProfilePage from "../../components/Profile"

const AdminDashboard = () => {

  const [active, setActive] = useState<string>("Dashboard")
  const changeActive = useCallback((selected: string) => setActive(selected), [])

  return (
    <>
        <div className='flex bg-blue-50'>
          <Sidebar active={active} changeActive={changeActive} />

          <div className='flex-1 flex flex-col max-h-screen overflow-auto bg-blue-50'>
            <div className="sticky top-0 z-50 bg-blue-50 shadow-md">
              <Navbar role={"Admin"} />
            </div>
            <div className="p-6 pb-12">
              {active === "Dashboard" && <h1>Dashboard</h1>}
              {active === "Notifications" && <NotificationList />}
              {active === "Users" && <UsersList />}
              {active === "Owners" && <OwnersList />}
              {active === "Profile" && <ProfilePage />}
            </div>
          </div>
        </div>
    </>
  )
}

export default AdminDashboard
