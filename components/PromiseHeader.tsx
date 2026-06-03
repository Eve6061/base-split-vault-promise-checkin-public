import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { TopTabs } from './TopTabs'
import { WalletButton } from './WalletButton'

export function PromiseHeader() {
  return (
    <header className="promise-header">
      <div className="brand-lockup">
        <Link className="brand-mark" href="/" aria-label="Open promise vault">
          <ShieldCheck size={20} aria-hidden="true" />
        </Link>
        <div>
          <p className="eyebrow">Base Proof Station</p>
          <h1>Promise Check-in Vault</h1>
        </div>
      </div>
      <TopTabs />
      <WalletButton />
    </header>
  )
}
