import { Route, Routes } from 'react-router-dom'
import './App.css'
import Registration from './pages/auth/Registration'
import Otp from './pages/auth/Otp'
import Login from './pages/auth/Login'
import Home from './pages/user/Home'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AuthSuccess from './pages/auth/components/googleAuth/AuthSuccess'
import AdminDashboard from './pages/admin/AdminDashboard'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import RoleBasedWrapper from './wrappers/RoleBasedWrapper'
import PublicRouteWrapper from './wrappers/PublicRouteWrapper'
import UserDashboard from './pages/user/dashboard/UserDashboard'

function App() {

  return (
    <Routes>
      <Route element={<PublicRouteWrapper />}>
        <Route path="/register/:role" element={<Registration />} />
        <Route path="/otp/:role/:email" element={<Otp />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/forgot-password/:role" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Route>

      <Route path="/" element={<Home />} />

      {/* user route */}
      <Route element={<RoleBasedWrapper allowedRoles={['user']} />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Route>


      {/* admin route */}
      <Route element={<RoleBasedWrapper allowedRoles={['admin']} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      {/* owner route */}
      <Route element={<RoleBasedWrapper allowedRoles={['owner']} />}>
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      </Route>

    </Routes>
  )
}

export default App
