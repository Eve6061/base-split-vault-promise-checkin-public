'use client'

import { Hash, ShieldCheck } from 'lucide-react'
import { CheckInButton } from '@/components/CheckInButton'
import { PromiseHeader } from '@/components/PromiseHeader'
import { PromiseStatusBoard } from '@/components/PromiseStatusBoard'
import { TodayStatusPanel } from '@/components/TodayStatusPanel'
import { usePromiseCheckinVault } from '@/hooks/usePromiseCheckinVault'
import { shortHash } from '@/lib/promiseLogic'

export default function HomePage() {
  const { vault, vaultError, checkInState, checkInToday, isConnected } = usePromiseCheckinVault()

  return (
    <div className="app-shell">
      <PromiseHeader />
      <main className="vault-grid">
        <section className="checkin-station">
          <div className="station-head">
            <p className="eyebrow">Live Promise Check-in Vault</p>
            <h2>Today action station</h2>
            <span>{isConnected ? 'Wallet linked' : 'Wallet required for live transactions'}</span>
          </div>
          <TodayStatusPanel status={vault.todayStatus} lastCheckIn={vault.lastCheckIn} />
          <div className="promise-command">
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <span>Active Promise</span>
              <strong>{vault.title}</strong>
            </div>
          </div>
          <CheckInButton state={checkInState} onCheckIn={checkInToday} />
          {vaultError ? (
            <div className="vault-error" role="alert">
              {vaultError}
            </div>
          ) : null}
          <div className="proof-inline">
            <Hash size={16} aria-hidden="true" />
            <span>Latest proof</span>
            <code>{shortHash(vault.proofHash)}</code>
          </div>
        </section>
        <PromiseStatusBoard vault={vault} />
      </main>
    </div>
  )
}
