import type { Address } from 'viem'

export const PROMISE_CHECKIN_VAULT_CONTRACT_ADDRESS =
  '0x4c03DE1d3b10c578E92c89D7082BEfC2355Ab16C' as Address

export const promiseCheckinVaultAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'createPromise',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'title', type: 'string' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'checkInToday',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ name: 'proofHash', type: 'bytes32' }]
  },
  {
    type: 'event',
    name: 'PromiseCreated',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'title', type: 'string', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PromiseCheckedIn',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'dayId', type: 'uint256', indexed: true },
      { name: 'streak', type: 'uint256', indexed: false },
      { name: 'proofHash', type: 'bytes32', indexed: false }
    ],
    anonymous: false
  },
  { type: 'error', name: 'EmptyPromiseTitle', inputs: [] },
  { type: 'error', name: 'TitleTooLong', inputs: [] },
  { type: 'error', name: 'ActivePromiseExists', inputs: [] },
  { type: 'error', name: 'PromiseNotFound', inputs: [] },
  { type: 'error', name: 'AlreadyCheckedInToday', inputs: [] }
] as const
