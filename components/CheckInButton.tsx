'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'

export function CheckInButton({
  state,
  onCheckIn
}: {
  state: 'idle' | 'pending' | 'confirmed'
  onCheckIn: () => void
}) {
  const pending = state === 'pending'
  const confirmed = state === 'confirmed'

  return (
    <button className={`checkin-button ${confirmed ? 'confirmed' : ''}`} disabled={pending} onClick={onCheckIn} type="button">
      {pending ? <Loader2 className="spin" size={22} aria-hidden="true" /> : <CheckCircle2 size={22} aria-hidden="true" />}
      {pending ? 'Confirming Proof' : confirmed ? 'Streak Confirmed' : 'Check In Today'}
    </button>
  )
}
