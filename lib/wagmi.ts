import { createClient, http } from 'viem'
import { createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from '@wagmi/connectors'

export const APP_ID = 'app-promise-checkin'
export const APP_NAME = 'Promise Check-in Vault'

// TODO: Replace this value after Base.dev verification.
export const BUILDER_CODE_SUFFIX = '' as `0x${string}` | ''
export const ACTIVE_BUILDER_CODE_SUFFIX =
  BUILDER_CODE_SUFFIX || undefined

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 500
    }),
    coinbaseWallet({
      appName: APP_NAME,
      preference: 'all',
      version: '4'
    })
  ],
  multiInjectedProviderDiscovery: false,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
      dataSuffix: ACTIVE_BUILDER_CODE_SUFFIX
    })
  },
  ssr: true
})
