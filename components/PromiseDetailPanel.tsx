import { FileClock, Hash } from 'lucide-react'
import { PromiseVault } from '@/lib/mockData'
import { shortHash } from '@/lib/promiseLogic'
import { StatusChip } from './StatusChip'
import { StreakMeter } from './StreakMeter'
import { TodayStatusPanel } from './TodayStatusPanel'

export function PromiseDetailPanel({ vault }: { vault: PromiseVault }) {
  return (
    <main className="detail-board">
      <section className="detail-proof">
        <div>
          <p className="eyebrow">Promise Proof Board</p>
          <h2>{vault.title}</h2>
          <StatusChip status={vault.status} />
        </div>
        <StreakMeter streak={vault.currentStreak} />
      </section>
      <section className="detail-grid">
        <TodayStatusPanel status={vault.todayStatus} lastCheckIn={vault.lastCheckIn} />
        <div className="proof-terminal">
          <Hash size={20} aria-hidden="true" />
          <span>Latest Proof</span>
          <code>{shortHash(vault.proofHash)}</code>
        </div>
        <div className="history-count">
          <FileClock size={20} aria-hidden="true" />
          <span>History Count</span>
          <strong>{vault.history.length}</strong>
        </div>
      </section>
    </main>
  )
}
