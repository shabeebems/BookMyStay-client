import { Route, Routes } from 'react-router-dom'
import './App.css'
import Registration from './pages/auth/Registration'
import Otp from './pages/auth/Otp'
import Login from './pages/auth/Login'
import Home from './pages/user/Home'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

function App() {

  return (
    <Routes>
      <Route path="/register/user" element={<Registration role={"user"} />} />
      <Route path="/register/owner" element={<Registration role={"owner"} />} />
      <Route path="/otp/:role/:email" element={<Otp />} />
      <Route path="/login/user" element={<Login role={"user"} />} />
      <Route path="/login/owner" element={<Login role={"owner"} />} />
      <Route path="/login/admin" element={<Login role={"admin"} />} />
      <Route path="/forgot-password/:role" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Home />} />

    </Routes>
  )
}

export default App
