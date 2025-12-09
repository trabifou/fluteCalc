import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import XiaoPage from './pages/XiaoPage'
import AcousticalPage from './pages/AcousticalPage'
import BenadePage from './pages/BenadePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/xiao" replace />} />
        <Route path="xiao" element={<XiaoPage />} />
        <Route path="acoustical" element={<AcousticalPage />} />
        <Route path="benade" element={<BenadePage />} />
      </Route>
    </Routes>
  )
}

export default App
