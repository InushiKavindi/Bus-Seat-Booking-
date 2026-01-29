import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getSchedulesByRoute } from '../api'

export default function SchedulePage() {
  const { routeId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [schedules, setSchedules] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setStatus('Loading schedules…')
      setSchedules([])
      try {
        const data = await getSchedulesByRoute(routeId)
        if (!active) return
        setSchedules(data)
        setStatus(data.length ? `Found ${data.length} schedule(s).` : 'No schedules found.')
      } catch (e) {
        setStatus('Failed to load schedules.')
      }
    }
    load()
    return () => { active = false }
  }, [routeId])

  function onBook(scheduleId) {
    navigate(`/book/${scheduleId}`)
  }

  // Optional route info if sent via navigation state
  const routeTitle = location.state?.title || `Route #${routeId}`
  const routeMeta = location.state?.meta || ''

  return (
    <div>
      <header className="bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-xl font-semibold">{routeTitle}</h1>
          {routeMeta && <p className="text-sm opacity-90">{routeMeta}</p>}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {status && <p className="mb-4 text-sm text-slate-700" aria-live="polite">{status}</p>}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schedules.map(s => (
            <article key={s.schedule_id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
              <div className="font-semibold mb-1">Bus {s.bus_no}</div>
              <div className="text-sm text-slate-700">Depart: {s.departure_time} • Arrive: {s.arrival_time}</div>
              <div className="text-xs text-slate-600 mt-1">Type: {s.type} • Status: {s.status ? 'Active' : 'Inactive'}</div>
              <button
                className="mt-3 h-9 px-3 rounded-md bg-emerald-600 text-white font-semibold"
                onClick={() => onBook(s.schedule_id)}
              >
                Book
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
