import React, { useState } from 'react'
import RouteSelector from './components/RouteSelector'
import RouteList from './components/RouteList'
import { getRoutesByCities } from './api'

export default function App() {
  const [routes, setRoutes] = useState([])
  const [status, setStatus] = useState('')

  async function handleSearch({ fromId, toId }) {
    setStatus('Searching routes…')
    setRoutes([])
    try {
      const data = await getRoutesByCities(fromId, toId)
      setRoutes(data)
      setStatus(data.length ? `Found ${data.length} route(s).` : 'No routes found.')
    } catch (e) {
      setStatus('Failed to fetch routes.')
    }
  }

  return (
    <div>
      <header className="bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-xl font-semibold">Find a Bus Route</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <RouteSelector onSearch={handleSearch} />
        {status && <p className="mt-4 text-sm text-slate-700" aria-live="polite">{status}</p>}
        <RouteList routes={routes} />
      </main>
    </div>
  )
}
