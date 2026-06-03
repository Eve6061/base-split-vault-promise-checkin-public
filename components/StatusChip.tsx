import { CheckCircle2, Clock3, Copy, ShieldAlert, Zap } from 'lucide-react'
import { PromiseStatus } from '@/lib/mockData'
import { getStatusTone } from '@/lib/promiseLogic'

const icons = {
  ready: Zap,
  pending: Clock3,
  'checked in': CheckCircle2,
  missed: ShieldAlert,
  confirmed: CheckCircle2,
  copied: Copy
}

export function StatusChip({ status }: { status: PromiseStatus }) {
  const Icon = icons[status]
  return (
    <span className={`status-chip ${getStatusTone(status)}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  )
}
