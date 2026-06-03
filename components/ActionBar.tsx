import Link from 'next/link'
import { ArrowRight, FileClock, Gauge } from 'lucide-react'

export function ActionBar() {
  return (
    <div className="action-bar">
      <Link href="/checkin">
        <Gauge size={16} aria-hidden="true" />
        Check In
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <Link href="/log">
        <FileClock size={16} aria-hidden="true" />
        View Log
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  )
}
