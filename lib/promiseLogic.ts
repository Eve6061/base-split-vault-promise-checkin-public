import { CheckInRecord, PromiseStatus, PromiseVault } from './mockData'

export function shortHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function getStatusTone(status: PromiseStatus) {
  if (status === 'confirmed' || status === 'checked in') return 'success'
  if (status === 'pending' || status === 'ready') return 'active'
  if (status === 'missed') return 'warning'
  return 'neutral'
}

export function createMockCheckIn(vault: PromiseVault): CheckInRecord {
  const nonce = Math.random().toString(16).slice(2, 14)
  return {
    id: `log-${vault.history.length + 1}`,
    date: 'Jun 02, 2026',
    time: '08:21 UTC',
    status: 'confirmed',
    proofHash: `0x8021${nonce.padEnd(60, 'a')}`
  }
}
