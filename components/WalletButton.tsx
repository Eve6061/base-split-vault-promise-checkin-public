'use client'

import { ChevronDown, LogOut, Wallet, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

type InjectedProvider = {
  isBase?: boolean
  isCoinbaseWallet?: boolean
  isMetaMask?: boolean
  isOkxWallet?: boolean
  isOKExWallet?: boolean
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  providers?: InjectedProvider[]
}

type WalletOption = {
  id: string
  label: string
  description: string
  connect: () => void
}

export function WalletButton() {
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)
  const [detectedProviders, setDetectedProviders] = useState<InjectedProvider[]>([])
  const autoConnectAttempted = useRef(false)

  const injectedConnector = connectors.find((connector) => connector.id === 'injected')
  const coinbaseConnector = connectors.find(
    (connector) =>
      connector.id.toLowerCase().includes('coinbase') ||
      connector.name.toLowerCase().includes('coinbase')
  )

  useEffect(() => {
    let mounted = true

    async function detectAvailableWallets() {
      const ethereum = typeof window === 'undefined' ? undefined : (window.ethereum as InjectedProvider | undefined)
      if (!mounted) return
      setDetectedProviders(getInjectedProviders(ethereum))
    }

    detectAvailableWallets()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (autoConnectAttempted.current || isConnected || isPending || !injectedConnector) return
    if (!detectedProviders.some(isBaseAppProvider)) return

    autoConnectAttempted.current = true
    connect({ connector: injectedConnector })
  }, [connect, detectedProviders, injectedConnector, isConnected, isPending])

  const connectInjected = useCallback(() => {
    if (!injectedConnector) return
    connect({ connector: injectedConnector })
    setOpen(false)
  }, [connect, injectedConnector])

  const connectCoinbase = useCallback(() => {
    if (!coinbaseConnector) return
    connect({ connector: coinbaseConnector })
    setOpen(false)
  }, [coinbaseConnector, connect])

  const walletOptions = useMemo<WalletOption[]>(() => {
    const injectedAvailable = Boolean(injectedConnector && detectedProviders.length)
    const hasBaseApp = detectedProviders.some(isBaseAppProvider)
    const options: WalletOption[] = []

    if (hasBaseApp) {
      options.push({
        id: 'base-app',
        label: 'Base App',
        description: 'Injected wallet',
        connect: connectInjected
      })
    }

    if (coinbaseConnector) {
      options.push({
        id: 'coinbase-wallet',
        label: 'Coinbase Wallet',
        description: 'Wallet SDK',
        connect: connectCoinbase
      })
    }

    if (injectedConnector) {
      options.push({
        id: 'metamask',
        label: 'MetaMask',
        description: 'Injected',
        connect: connectInjected
      })
      options.push({
        id: 'okx',
        label: 'OKX Wallet',
        description: 'Injected',
        connect: connectInjected
      })
    }

    if (injectedAvailable && !hasBaseApp) {
      options.push({
        id: 'browser-wallet',
        label: 'Browser Wallet',
        description: 'Injected wallet',
        connect: connectInjected
      })
    }

    return options
  }, [coinbaseConnector, connectCoinbase, connectInjected, detectedProviders, injectedConnector])

  return (
    <div className="wallet-menu-wrap">
      <button
        className="wallet-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Wallet size={16} aria-hidden="true" />
        {isPending
          ? 'Connecting'
          : isConnected
            ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
            : 'Connect Wallet'}
        {open ? <X size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
      </button>
      {open ? (
        <div className="wallet-menu" role="menu">
          {isConnected ? (
            <button onClick={() => disconnect()} role="menuitem" type="button">
              <span>{activeConnector?.name ?? 'Connected'}</span>
              <small>
                <LogOut size={12} aria-hidden="true" />
                Disconnect
              </small>
            </button>
          ) : walletOptions.length ? (
            walletOptions.map((option) => (
              <button
                disabled={isPending}
                key={option.id}
                onClick={option.connect}
                role="menuitem"
                type="button"
              >
                <span>{option.label}</span>
                <small>{isPending ? 'Connecting' : option.description}</small>
              </button>
            ))
          ) : (
            <div className="wallet-menu-empty">Wallet connectors unavailable</div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function getInjectedProviders(ethereum?: InjectedProvider) {
  if (!ethereum) return []
  return ethereum.providers?.length ? ethereum.providers : [ethereum]
}

function isBaseAppProvider(provider: InjectedProvider) {
  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent.toLowerCase()
  return Boolean(provider.isBase || userAgent.includes('baseapp') || userAgent.includes('base app'))
}
