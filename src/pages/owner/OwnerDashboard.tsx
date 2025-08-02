import { useCallback, useState } from "react"
import OwnerSidebar from "./components/Sidebar"
import ProfilePage from "../../components/Profile"
import Navbar from "../../components/Navbar"

const OwnerDashboard = () => {

  const [active, setActive] = useState<string>("Dashboard")
  const changeActive = useCallback((selected: string) => setActive(selected), [])

  return (
    <>
      <div className='flex'>
        <OwnerSidebar active={active} changeActive={changeActive} isVerified={true} />
          
          <div className='flex-1 flex flex-col max-h-screen overflow-auto bg-blue-50'>
            <div className="sticky top-0 z-50 bg-blue-50 shadow-md">
              <Navbar role={"Owner"} />
            </div>
            <div className="p-6 pb-12">
              {active === "Dashboard" && <h1>Dashboard</h1>}
              {active === "Profile" && <ProfilePage />}
            </div>
          </div>

        {/* <div className='flex-1 max-h-screen'>
          {active === "Dashboard" && <h1>Dashboard</h1>}
          {active === "Profile" && <ProfilePage />}
        </div> */}
      </div>
    </>
  )
}

export default OwnerDashboard