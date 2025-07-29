import { useCallback, useState } from "react"
import Navbar from "../../../components/Navbar"
import ProfilePage from "../../../components/Profile"
import UserSidebar from "../components/Sidebar"

const UserDashboard = () => {
    const [active, setActive] = useState<string>("Dashboard")
    const changeActive = useCallback((selected: string) => setActive(selected), [])
    
  return (
    <>
        <div className='flex'>
            <UserSidebar active={active} changeActive={changeActive} />
            <div className='flex-1 flex flex-col max-h-screen overflow-auto bg-blue-50'>
                <div className="sticky top-0 z-50 bg-blue-50 shadow-md">
                    <Navbar role={"User"} />
                </div>
                <div className="p-6 pb-12">
                    {active === "Dashboard" && <h1>Dashboard</h1>}
                    {active === "Profile" && <ProfilePage />}
                </div>
            </div>
        </div>
    </>
  )
}

export default UserDashboard