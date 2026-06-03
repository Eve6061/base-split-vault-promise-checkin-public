declare module '@/utils/track' {
  export function trackTransaction(
    appId: string,
    appName: string,
    userAddress: string | undefined,
    txHash: string
  ): Promise<void>
}
