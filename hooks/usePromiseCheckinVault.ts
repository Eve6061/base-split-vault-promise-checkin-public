'use client'

import { useMemo, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import {
  PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
  promiseCheckinVaultAbi
} from '@/lib/contracts'
import { ACTIVE_BUILDER_CODE_SUFFIX, APP_ID, APP_NAME } from '@/lib/wagmi'
import { mockPromiseVault, PromiseVault } from '@/lib/mockData'
import { createMockCheckIn } from '@/lib/promiseLogic'
import { trackTransaction } from '@/utils/track'

type CheckInState = 'idle' | 'pending' | 'confirmed'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function getVaultErrorMessage(error: unknown, fallback: string) {
  const details = error instanceof Error ? error.message : String(error)

  if (details.includes('User rejected') || details.includes('User denied')) {
    return 'Wallet request was rejected.'
  }

  if (details.includes('AlreadyCheckedInToday')) {
    return 'Already checked in today.'
  }

  if (details.includes('PromiseNotFound')) {
    return 'Create a promise before checking in.'
  }

  if (details.includes('ActivePromiseExists')) {
    return 'This wallet already has an active promise.'
  }

  if (details.includes('EmptyPromiseTitle')) {
    return 'Promise line cannot be empty.'
  }

  if (details.includes('TitleTooLong')) {
    return 'Promise line is too long.'
  }

  return fallback
}

export function usePromiseCheckinVault() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [vault, setVault] = useState<PromiseVault>(mockPromiseVault)
  const [checkInState, setCheckInState] = useState<CheckInState>('idle')
  const [vaultError, setVaultError] = useState<string | null>(null)

  const hasActivePromise = useMemo(() => Boolean(vault.id), [vault.id])
  const hasLiveContract = PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS !== ZERO_ADDRESS

  async function createPromise(title: string) {
    if (!title.trim()) return
    setVaultError(null)

    if (!isConnected) {
      setVaultError('Connect a wallet before creating a promise.')
      return
    }

    try {
      if (hasLiveContract) {
        const txHash = await writeContractAsync({
          address: PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
          abi: promiseCheckinVaultAbi,
          functionName: 'createPromise',
          args: [title.trim()],
          dataSuffix: ACTIVE_BUILDER_CODE_SUFFIX
        })
        trackTransaction(APP_ID, APP_NAME, address, txHash)
      }

      setVault((current) => ({
        ...current,
        title: title.trim(),
        status: 'ready',
        todayStatus: 'ready'
      }))
    } catch (error) {
      setVault((current) => ({ ...current, todayStatus: 'ready' }))
      setVaultError(getVaultErrorMessage(error, 'Could not create promise. Check your wallet and try again.'))
    }
  }

  async function checkInToday() {
    if (checkInState === 'pending') return
    setVaultError(null)

    if (!isConnected) {
      setVaultError('Connect a wallet before checking in.')
      return
    }

    setCheckInState('pending')
    setVault((current) => ({ ...current, todayStatus: 'pending' }))

    try {
      const txHash = await writeContractAsync({
        address: PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
        abi: promiseCheckinVaultAbi,
        functionName: 'checkInToday',
        dataSuffix: ACTIVE_BUILDER_CODE_SUFFIX
      })

      const record = createMockCheckIn(vault)

      setVault((current) => ({
        ...current,
        status: 'confirmed',
        todayStatus: 'checked in',
        currentStreak: current.currentStreak + 1,
        lastCheckIn: `${record.date} ${record.time}`,
        proofHash: record.proofHash,
        history: [record, ...current.history]
      }))
      setCheckInState('confirmed')
      trackTransaction(APP_ID, APP_NAME, address, txHash)
    } catch (error) {
      setVault((current) => ({ ...current, todayStatus: 'ready' }))
      setCheckInState('idle')
      setVaultError(getVaultErrorMessage(error, 'Could not check in. Check your wallet and try again.'))
    }
  }

  return {
    address,
    isConnected,
    hasActivePromise,
    vault,
    vaultError,
    checkInState,
    hasLiveContract,
    createPromise,
    checkInToday
  }
}

// TODO: Replace mock reads with wagmi useReadContract calls.
