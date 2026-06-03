'use client'

import { ChevronDown, LogOut, Wallet, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)
  const [availableConnectorIds, setAvailableConnectorIds] = useState<Set<string> | null>(null)

  const walletOptions = useMemo(
    () =>
      connectors.flatMap((connector) => {
        const key = `${connector.id}-${connector.name}`
        const isSdkWallet = connector.id.includes('coinbase')
        if (availableConnectorIds && !availableConnectorIds.has(key) && !isSdkWallet) return []

        if (connector.id.includes('coinbase')) return { connector, label: 'Coinbase Wallet' }
        if (connector.name.toLowerCase().includes('okx')) return { connector, label: 'OKX Wallet' }
        if (connector.name.toLowerCase().includes('metamask')) return { connector, label: 'MetaMask' }
        if (connector.name.toLowerCase().includes('base')) return { connector, label: 'Base App' }
        return { connector, label: connector.name }
      }),
    [availableConnectorIds, connectors]
  )

  useEffect(() => {
    let mounted = true

    async function detectAvailableWallets() {
      const entries = await Promise.all(
        connectors.map(async (connector) => {
          const key = `${connector.id}-${connector.name}`
          if (connector.id.includes('coinbase')) return [key, true] as const

          try {
            const provider = await connector.getProvider()
            return [key, Boolean(provider)] as const
          } catch {
            return [key, false] as const
          }
        })
      )

      if (!mounted) return
      setAvailableConnectorIds(
        new Set(entries.filter(([, available]) => available).map(([key]) => key))
      )
    }

    detectAvailableWallets()

    return () => {
      mounted = false
    }
  }, [connectors])

  function handleConnect(connector: (typeof connectors)[number]) {
    connect({ connector })
    setOpen(false)
  }

  if (isConnected) {
    return (
      <div className="wallet-menu-wrap">
        <button className="wallet-button connected" onClick={() => disconnect()} type="button">
          <Wallet size={16} aria-hidden="true" />
          <span>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}</span>
          <LogOut size={15} aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="wallet-menu-wrap">
      <button
        className="wallet-button"
        disabled={!walletOptions.length || isPending}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Wallet size={16} aria-hidden="true" />
        {isPending ? 'Connecting' : 'Connect Wallet'}
        {open ? <X size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
      </button>
      {open ? (
        <div className="wallet-menu" role="menu">
          {walletOptions.length ? (
            walletOptions.map(({ connector, label }) => (
              <button
                disabled={isPending}
                key={`${connector.id}-${connector.name}`}
                onClick={() => handleConnect(connector)}
                role="menuitem"
                type="button"
              >
                <span>{label}</span>
                <small>{isPending ? 'Connecting' : 'Select'}</small>
              </button>
            ))
          ) : (
            <div className="wallet-menu-empty">No wallet detected</div>
          )}
        </div>
      ) : null}
    </div>
  )
}
