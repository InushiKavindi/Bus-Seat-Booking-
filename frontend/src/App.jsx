import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SchedulePage from './pages/SchedulePage'
import BookingPage from './pages/BookingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/routes/:routeId" element={<SchedulePage />} />
      <Route path="/book/:scheduleId" element={<BookingPage />} />
    </Routes>
  )
}
