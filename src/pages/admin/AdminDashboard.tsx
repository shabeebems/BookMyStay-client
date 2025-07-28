import { useCallback, useState } from "react"
import Sidebar from "./components/Sidebar"
import UsersList from "./pages/UsersList"
import OwnersList from "./pages/OwnersList"

const AdminDashboard = () => {

  const [active, setActive] = useState<string>("Dashboard")

  const changeActive = useCallback((selected: string) => setActive(selected), [])

  return (
    <>
        <div className='flex bg-blue-50'>
            <Sidebar active={active} changeActive={changeActive} />

            <div className='flex-1 max-h-screen'>
              {active === "Dashboard" && <h1>Dashboard</h1>}
              {active === "Users" && <UsersList />}
              {active === "Owners" && <OwnersList />}
            </div>

        </div>
    </>
  )
}

export default AdminDashboard
