import { CalendarCheck, Clock3 } from 'lucide-react'
import { PromiseStatus } from '@/lib/mockData'
import { StatusChip } from './StatusChip'

export function TodayStatusPanel({ status, lastCheckIn }: { status: PromiseStatus; lastCheckIn: string }) {
  return (
    <section className="today-panel">
      <div className="today-panel-top">
        <div>
          <p className="eyebrow">Today Status</p>
          <h2>{status === 'checked in' ? 'Proof Confirmed' : 'Ready For Check-in'}</h2>
        </div>
        <CalendarCheck size={28} aria-hidden="true" />
      </div>
      <StatusChip status={status} />
      <div className="last-check">
        <Clock3 size={16} aria-hidden="true" />
        <span>Last check-in: {lastCheckIn}</span>
      </div>
    </section>
  )
}
