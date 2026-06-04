'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address, Hash } from 'viem'
import { base } from 'wagmi/chains'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'
import {
  PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
  promiseCheckinVaultAbi
} from '@/lib/contracts'
import { ACTIVE_BUILDER_CODE_SUFFIX, APP_ID, APP_NAME } from '@/lib/wagmi'
import { CheckInRecord, PromiseVault } from '@/lib/mockData'
import { trackTransaction } from '@/utils/track'

type CheckInState = 'idle' | 'pending' | 'confirmed'
type PromiseCreatedLog = {
  args: { title?: string }
}
type PromiseCheckedInLog = {
  args: { dayId?: bigint; streak?: bigint; proofHash?: Hash }
  blockNumber: bigint | null
  logIndex: number | null
  transactionHash: Hash | null
}
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const DAY_SECONDS = 86_400

const emptyVault: PromiseVault = {
  id: '',
  title: 'Connect a wallet to load your active promise',
  owner: '',
  status: 'ready',
  todayStatus: 'ready',
  currentStreak: 0,
  lastCheckIn: 'No check-in yet',
  proofHash: ZERO_ADDRESS,
  history: []
}

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
  const publicClient = usePublicClient({ chainId: base.id })
  const { writeContractAsync } = useWriteContract()
  const [vault, setVault] = useState<PromiseVault>(emptyVault)
  const [checkInState, setCheckInState] = useState<CheckInState>('idle')
  const [vaultError, setVaultError] = useState<string | null>(null)
  const [isVaultLoading, setIsVaultLoading] = useState(false)

  const hasActivePromise = useMemo(() => Boolean(vault.id), [vault.id])
  const hasLiveContract = PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS !== ZERO_ADDRESS

  const loadVault = useCallback(async () => {
    if (!isConnected || !address || !publicClient || !hasLiveContract) {
      setVault({
        ...emptyVault,
        title: isConnected ? 'No active promise found' : emptyVault.title,
        owner: address ?? ''
      })
      return
    }

    setIsVaultLoading(true)

    try {
      const [createdLogs, checkInLogs] = await Promise.all([
        publicClient.getContractEvents({
          address: PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
          abi: promiseCheckinVaultAbi,
          eventName: 'PromiseCreated',
          args: { owner: address },
          fromBlock: BigInt(0),
          toBlock: 'latest'
        }),
        publicClient.getContractEvents({
          address: PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS,
          abi: promiseCheckinVaultAbi,
          eventName: 'PromiseCheckedIn',
          args: { owner: address },
          fromBlock: BigInt(0),
          toBlock: 'latest'
        })
      ])

      const promiseCreatedLogs = createdLogs as PromiseCreatedLog[]
      const promiseCheckInLogs = checkInLogs as PromiseCheckedInLog[]
      const latestCreated = promiseCreatedLogs.at(-1)

      if (!latestCreated?.args.title) {
        setVault({
          ...emptyVault,
          title: 'Create your first promise to start tracking on-chain',
          owner: formatOwner(address)
        })
        return
      }

      const sortedCheckIns = [...promiseCheckInLogs].sort((a, b) => {
        if (!a.blockNumber || !b.blockNumber) return 0
        return Number(b.blockNumber - a.blockNumber)
      })
      const blockTimestamps = await loadBlockTimestamps(
        publicClient,
        sortedCheckIns.flatMap((log) => (log.blockNumber ? [log.blockNumber] : []))
      )
      const history = sortedCheckIns.map((log, index) =>
        toCheckInRecord(log, blockTimestamps.get(log.blockNumber ?? BigInt(0)), index)
      )
      const latestCheckIn = sortedCheckIns[0]
      const latestRecord = history[0]
      const todayDayId = BigInt(Math.floor(Date.now() / 1000 / DAY_SECONDS))
      const checkedInToday = latestCheckIn?.args.dayId === todayDayId
      const latestStreak = Number(latestCheckIn?.args.streak ?? BigInt(0))

      setVault({
        id: `promise-${address.slice(2, 8).toLowerCase()}`,
        title: latestCreated.args.title,
        owner: formatOwner(address),
        status: checkedInToday ? 'confirmed' : 'ready',
        todayStatus: checkedInToday ? 'checked in' : 'ready',
        currentStreak: latestStreak,
        lastCheckIn: latestRecord ? `${latestRecord.date} ${latestRecord.time}` : 'No check-in yet',
        proofHash: latestRecord?.proofHash ?? ZERO_ADDRESS,
        history
      })
      setCheckInState(checkedInToday ? 'confirmed' : 'idle')
    } catch (error) {
      setVaultError(getVaultErrorMessage(error, 'Could not load on-chain promise data.'))
    } finally {
      setIsVaultLoading(false)
    }
  }, [address, hasLiveContract, isConnected, publicClient])

  useEffect(() => {
    loadVault()
  }, [loadVault])

  async function waitForReceipt(txHash: Hash) {
    if (!publicClient) return
    await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1
    })
  }

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
          chainId: base.id,
          dataSuffix: ACTIVE_BUILDER_CODE_SUFFIX
        })
        trackTransaction(APP_ID, APP_NAME, address, txHash)
        await waitForReceipt(txHash)
      }

      await loadVault()
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
        chainId: base.id,
        dataSuffix: ACTIVE_BUILDER_CODE_SUFFIX
      })
      trackTransaction(APP_ID, APP_NAME, address, txHash)
      await waitForReceipt(txHash)
      await loadVault()
      setCheckInState('confirmed')
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
    isVaultLoading,
    createPromise,
    refreshVault: loadVault,
    checkInToday
  }
}

function formatOwner(owner: Address) {
  return `${owner.slice(0, 6)}...${owner.slice(-4)}`
}

async function loadBlockTimestamps(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  blockNumbers: bigint[]
) {
  const uniqueBlockNumbers = [...new Set(blockNumbers.map((blockNumber) => blockNumber.toString()))].map(BigInt)
  const entries = await Promise.all(
    uniqueBlockNumbers.map(async (blockNumber) => {
      const block = await publicClient.getBlock({ blockNumber })
      return [blockNumber.toString(), Number(block.timestamp)] as const
    })
  )

  return new Map(entries.map(([blockNumber, timestamp]) => [BigInt(blockNumber), timestamp]))
}

function toCheckInRecord(
  log: PromiseCheckedInLog,
  timestamp = Math.floor(Date.now() / 1000),
  index: number
): CheckInRecord {
  const date = new Date(timestamp * 1000)
  const proofHash = log.args.proofHash ?? ZERO_ADDRESS

  return {
    id: `${log.transactionHash ?? 'checkin'}-${log.logIndex ?? index}`,
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }),
    time: `${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    })} UTC`,
    status: 'confirmed',
    proofHash
  }
}
