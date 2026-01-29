import React from 'react'

export default function RouteList({ routes }) {
  if (!routes) return null
  if (routes.length === 0) {
    return <p className="mt-4 text-sm text-slate-700">No routes found.</p>
  }
  return (
    <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((r) => (
        <article key={r.route_id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold mb-1">{r.route_no ? `Route ${r.route_no}` : `Route #${r.route_id}`}</h3>
          <div className="text-sm text-slate-700">{r.from_city_name} → {r.to_city_name}</div>
        </article>
      ))}
    </section>
  )
}
