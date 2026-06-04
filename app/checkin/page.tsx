'use client'

import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { CheckInButton } from '@/components/CheckInButton'
import { PromiseComposer } from '@/components/PromiseComposer'
import { PromiseHeader } from '@/components/PromiseHeader'
import { StatusChip } from '@/components/StatusChip'
import { StreakMeter } from '@/components/StreakMeter'
import { TodayStatusPanel } from '@/components/TodayStatusPanel'
import { usePromiseCheckinVault } from '@/hooks/usePromiseCheckinVault'

export default function CheckInPage() {
  const { vault, vaultError, checkInState, checkInToday, createPromise } = usePromiseCheckinVault()

  return (
    <div className="app-shell">
      <PromiseHeader />
      <main className="checkin-page">
        <section className="action-station">
          <div className="station-head">
            <p className="eyebrow">Check-in Station</p>
            <h2>Confirm today&apos;s promise proof</h2>
            <span>Ready, pending, and confirmed states stay visible.</span>
          </div>
          <TodayStatusPanel status={vault.todayStatus} lastCheckIn={vault.lastCheckIn} />
          <CheckInButton state={checkInState} onCheckIn={checkInToday} />
          {vaultError ? (
            <div className="vault-error" role="alert">
              {vaultError}
            </div>
          ) : null}
        </section>
        <aside className="commitment-side">
          <section className="rule-panel">
            <ShieldCheck size={22} aria-hidden="true" />
            <div>
              <span>Rule</span>
              <strong>One wallet, one active promise</strong>
            </div>
          </section>
          <PromiseComposer onCreate={createPromise} />
          <section className="current-promise">
            <div>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>Current Promise</span>
            </div>
            <p>{vault.title}</p>
            <StatusChip status={vault.status} />
          </section>
          <StreakMeter streak={vault.currentStreak} />
        </aside>
      </main>
    </div>
  )
}
