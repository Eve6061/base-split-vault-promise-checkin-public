import Link from 'next/link'
import { BadgeCheck, ListChecks } from 'lucide-react'
import { publicPromises } from '@/lib/mockData'
import { StatusChip } from './StatusChip'

export function PromiseRail() {
  return (
    <aside className="promise-rail">
      <div className="rail-heading">
        <ListChecks size={18} aria-hidden="true" />
        <span>Public Streak Board</span>
      </div>
      {publicPromises.map((promise) => (
        <Link className="promise-block" href={`/promise/${promise.id}`} key={promise.id}>
          <div>
            <BadgeCheck size={18} aria-hidden="true" />
            <strong>{promise.streak}</strong>
          </div>
          <p>{promise.title}</p>
          <StatusChip status={promise.status} />
        </Link>
      ))}
    </aside>
  )
}
