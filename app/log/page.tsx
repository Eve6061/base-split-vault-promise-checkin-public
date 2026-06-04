'use client'

import { FileClock, Hash } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { PromiseHeader } from '@/components/PromiseHeader'
import { StreakLogList } from '@/components/StreakLogList'
import { usePromiseCheckinVault } from '@/hooks/usePromiseCheckinVault'
import { shortHash } from '@/lib/promiseLogic'

export default function StreakLogPage() {
  const { vault } = usePromiseCheckinVault()
  const latest = vault.history[0]

  return (
    <div className="app-shell log-shell">
      <PromiseHeader />
      <main className="log-page">
        <section className="ledger-head">
          <div>
            <p className="eyebrow">Streak Ledger</p>
            <h2>Daily proof timeline</h2>
          </div>
          <FileClock size={34} aria-hidden="true" />
        </section>
        {latest ? (
          <>
            <section className="latest-proof">
              <div>
                <Hash size={18} aria-hidden="true" />
                <span>Latest confirmed check-in</span>
              </div>
              <strong>{latest.date}</strong>
              <code>{shortHash(latest.proofHash)}</code>
            </section>
            <StreakLogList records={vault.history} />
          </>
        ) : (
          <EmptyState title="No Check-ins Yet" detail="Create a promise and check in once to generate your first on-chain proof." />
        )}
      </main>
    </div>
  )
}
