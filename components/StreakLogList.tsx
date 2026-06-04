import { FileCheck2 } from 'lucide-react'
import { CheckInRecord } from '@/lib/mockData'
import { shortHash } from '@/lib/promiseLogic'
import { StatusChip } from './StatusChip'

export function StreakLogList({ records }: { records: CheckInRecord[] }) {
  return (
    <section className="streak-log-list">
      {records.map((record, index) => (
        <article className={index === 0 ? 'latest' : ''} key={record.id}>
          <div className="log-pin">
            <FileCheck2 size={18} aria-hidden="true" />
          </div>
          <div className="log-main">
            <div className="log-topline">
              <strong>{record.date}</strong>
              <StatusChip status={record.status} />
            </div>
            <span>{record.time}</span>
            <code>{shortHash(record.proofHash)}</code>
          </div>
        </article>
      ))}
    </section>
  )
}
