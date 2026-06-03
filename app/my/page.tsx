'use client'

import { PromiseHeader } from '@/components/PromiseHeader'
import { MyPromisePanel } from '@/components/MyPromisePanel'
import { usePromiseCheckinVault } from '@/hooks/usePromiseCheckinVault'

export default function MyPromisePage() {
  const { vault, hasActivePromise } = usePromiseCheckinVault()

  return (
    <div className="app-shell my-shell">
      <PromiseHeader />
      <MyPromisePanel vault={vault} hasActivePromise={hasActivePromise} />
    </div>
  )
}
