import React, { useEffect, useMemo, useState } from 'react'
import { getCities } from '../api'

export default function RouteSelector({ onSearch }) {
  const [cities, setCities] = useState([])
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const cs = await getCities()
        if (!active) return
        setCities(cs)
      } catch (e) {
        setError('Failed to load cities')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const canSearch = useMemo(() => !!fromId && !!toId, [fromId, toId])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr,1fr,auto] gap-3 items-end bg-white p-4 rounded-lg shadow">
      <div>
        <label htmlFor="fromCity" className="block text-sm text-slate-600 mb-1">From</label>
        <select id="fromCity" value={fromId} onChange={e => setFromId(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white">
          <option value="" disabled>Select origin city</option>
          {cities.map(c => (
            <option key={c.city_id} value={String(c.city_id)}>{c.city_name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="toCity" className="block text-sm text-slate-600 mb-1">To</label>
        <select id="toCity" value={toId} onChange={e => setToId(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white">
          <option value="" disabled>Select destination city</option>
          {cities.map(c => (
            <option key={c.city_id} value={String(c.city_id)}>{c.city_name}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onSearch({ fromId, toId })}
        disabled={!canSearch || loading}
        aria-busy={loading}
      >
        {loading ? 'Loading…' : 'Search Routes'}
      </button>
      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
    </section>
  )
}
