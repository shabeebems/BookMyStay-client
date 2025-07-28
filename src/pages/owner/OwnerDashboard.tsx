import { useCallback, useState } from "react"
import OwnerSidebar from "./components/Sidebar"
import ProfilePage from "./pages/Profile"

const OwnerDashboard = () => {

  const [active, setActive] = useState<string>("Dashboard")
  const changeActive = useCallback((selected: string) => setActive(selected), [])

  return (
    <>
      <div className='flex'>
        <OwnerSidebar active={active} changeActive={changeActive} />
          
        <div className='flex-1 max-h-screen'>
          {active === "Dashboard" && <h1>Dashboard</h1>}
          {active === "Profile" && <ProfilePage />}
        </div>
      </div>
    </>
  )
}

export default OwnerDashboard