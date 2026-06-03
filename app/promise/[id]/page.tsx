'use client'

import { PromiseDetailPanel } from '@/components/PromiseDetailPanel'
import { PromiseHeader } from '@/components/PromiseHeader'
import { usePromiseCheckinVault } from '@/hooks/usePromiseCheckinVault'

export default function PromiseDetailPage() {
  const { vault } = usePromiseCheckinVault()

  return (
    <div className="app-shell detail-shell">
      <PromiseHeader />
      <PromiseDetailPanel vault={vault} />
    </div>
  )
}
