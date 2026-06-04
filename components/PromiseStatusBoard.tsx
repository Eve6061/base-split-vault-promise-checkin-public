import { Hash, ShieldCheck } from 'lucide-react'
import { PromiseVault } from '@/lib/mockData'
import { shortHash } from '@/lib/promiseLogic'
import { StatusChip } from './StatusChip'
import { StreakMeter } from './StreakMeter'

export function PromiseStatusBoard({ vault }: { vault: PromiseVault }) {
  return (
    <aside className="promise-status-board">
      <div className="board-title">
        <ShieldCheck size={20} aria-hidden="true" />
        <span>Vault State</span>
      </div>
      <StreakMeter streak={vault.currentStreak} />
      <div className="proof-slab">
        <div>
          <Hash size={16} aria-hidden="true" />
          <span>Proof Hash</span>
        </div>
        <code>{shortHash(vault.proofHash)}</code>
      </div>
      <div className="state-row">
        <span>Promise</span>
        <StatusChip status={vault.status} />
      </div>
      <div className="state-row">
        <span>Today</span>
        <StatusChip status={vault.todayStatus} />
      </div>
    </aside>
  )
}
