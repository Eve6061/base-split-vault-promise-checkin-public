import { createClient, http } from 'viem'
import { createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from '@wagmi/connectors'

export const APP_ID = 'app-promise-checkin'
export const APP_NAME = 'Promise Check-in Vault'

export const BUILDER_CODE = 'bc_0hwugo1v'
export const BUILDER_CODE_SUFFIX =
  '0x62635f30687775676f31760b0080218021802180218021802180218021' as `0x${string}`
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
