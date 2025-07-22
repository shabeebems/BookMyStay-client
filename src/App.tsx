import { Route, Routes } from 'react-router-dom'
import './App.css'
import Registration from './pages/auth/Registration'
import Otp from './pages/auth/Otp'
import Login from './pages/auth/Login'

function App() {

  return (
    <Routes>
      <Route path="/register/user" element={<Registration role={"user"} />} />
      <Route path="/register/admin" element={<Registration role={"admin"} />} />
      <Route path="/otp/:role/:email" element={<Otp />} />
      <Route path="/login/user" element={<Login role={"user"} />} />
      <Route path="/login/admin" element={<Login role={"admin"} />} />
    </Routes>
  )
}

export default App
