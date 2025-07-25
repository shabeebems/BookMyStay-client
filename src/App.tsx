import { Route, Routes } from 'react-router-dom'
import './App.css'
import Registration from './pages/auth/Registration'
import Otp from './pages/auth/Otp'
import Login from './pages/auth/Login'
import Home from './pages/user/Home'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AuthSuccess from './pages/auth/components/googleAuth/AuthSuccess'

function App() {

  return (
    <Routes>
      <Route path="/register/:role" element={<Registration />} />
      <Route path="/otp/:role/:email" element={<Otp />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/forgot-password/:role" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth-success" element={<AuthSuccess />} /> {/* Google Auth Success */}

      <Route path="/" element={<Home />} />

    </Routes>
  )
}

export default App
