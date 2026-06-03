import Link from 'next/link'
import { ArrowRight, CircleDot, UserCheck } from 'lucide-react'
import { PromiseVault } from '@/lib/mockData'
import { StatusChip } from './StatusChip'

export function MyPromisePanel({
  vault,
  hasActivePromise
}: {
  vault: PromiseVault
  hasActivePromise: boolean
}) {
  return (
    <main className="my-promise-panel">
      <section className="wallet-record">
        <div>
          <p className="eyebrow">Personal Commitment Record</p>
          <h2>{hasActivePromise ? 'Active Promise Found' : 'No Active Promise'}</h2>
        </div>
        <UserCheck size={34} aria-hidden="true" />
      </section>
      <section className="record-line">
        <div className="record-title">
          <CircleDot size={18} aria-hidden="true" />
          <span>{vault.title}</span>
        </div>
        <StatusChip status={vault.status} />
      </section>
      <section className="record-metrics">
        <div>
          <span>Current streak</span>
          <strong>{vault.currentStreak}</strong>
        </div>
        <div>
          <span>Today</span>
          <strong>{vault.todayStatus}</strong>
        </div>
        <div>
          <span>Latest miss</span>
          <strong>May 29</strong>
        </div>
      </section>
      <section className="recent-checkins">
        <h3>Recent Check-ins</h3>
        {vault.history.slice(0, 3).map((record) => (
          <div key={record.id}>
            <span>{record.date}</span>
            <StatusChip status={record.status} />
          </div>
        ))}
      </section>
      <div className="my-actions">
        <Link href="/checkin">
          Check In
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/log">
          View Log
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}
