'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

export function CopyProofButton({ proofHash }: { proofHash: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard?.writeText(proofHash)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button className="copy-proof" onClick={handleCopy} type="button">
      <Copy size={16} aria-hidden="true" />
      {copied ? 'Copied' : 'Copy Proof'}
    </button>
  )
}
