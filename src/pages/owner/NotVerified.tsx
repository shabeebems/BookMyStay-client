import { useCallback, useState } from "react"
import Sidebar from "./components/Sidebar"
import Navbar from "../../components/Navbar"
import ProfileVerification from "./components/ProfileVerification"
import NotificationPage from "./pages/Notification"

const NotVerified = () => {
  
  const [active, setActive] = useState<string>("Dashboard")
  const changeActive = useCallback((selected: string) => setActive(selected), [])
  
  return (
    <>
        <div className='flex bg-blue-50'>
          <Sidebar active={active} changeActive={changeActive} isVerified={false} />
          <div className='flex-1 flex flex-col max-h-screen overflow-auto bg-blue-50'>
            <div className="sticky top-0 z-50 bg-blue-50 shadow-md">
              <Navbar role={"owner"} />
            </div>
            <div className="p-6 pb-12">
              {active === "Dashboard" && <ProfileVerification /> }
              {active === "Notification" && <NotificationPage />}
            </div>
          </div>
        </div>
    </>
  )
}

export default NotVerified