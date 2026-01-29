import React from 'react'
import { useParams, Link } from 'react-router-dom'

export default function BookingPage() {
  const { scheduleId } = useParams()
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold">Booking for Schedule #{scheduleId}</h1>
      <p className="mt-2 text-slate-700">Booking flow will go here (seat selection, passenger details, etc.).</p>
      <Link className="inline-block mt-4 text-blue-600 hover:underline" to="/">Back to search</Link>
    </div>
  )
}
