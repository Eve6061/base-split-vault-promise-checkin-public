export type PromiseStatus = 'ready' | 'pending' | 'checked in' | 'missed' | 'confirmed' | 'copied'

export type CheckInRecord = {
  id: string
  date: string
  time: string
  status: PromiseStatus
  proofHash: string
}

export type PromiseVault = {
  id: string
  title: string
  owner: string
  status: PromiseStatus
  todayStatus: PromiseStatus
  currentStreak: number
  lastCheckIn: string
  proofHash: string
  history: CheckInRecord[]
}

export const mockPromiseVault: PromiseVault = {
  id: 'promise-8021',
  title: 'Ship one verified product improvement every day',
  owner: '0x8021...F7A4',
  status: 'confirmed',
  todayStatus: 'ready',
  currentStreak: 18,
  lastCheckIn: 'Jun 01, 2026 21:14 UTC',
  proofHash: '0x8b21f4d0c0ffee8021a994c13e99fa77e42aa0e513cc7a1d492fedf51b4a8c09',
  history: [
    {
      id: 'log-018',
      date: 'Jun 01, 2026',
      time: '21:14 UTC',
      status: 'confirmed',
      proofHash: '0x8b21f4d0c0ffee8021a994c13e99fa77e42aa0e513cc7a1d492fedf51b4a8c09'
    },
    {
      id: 'log-017',
      date: 'May 31, 2026',
      time: '20:58 UTC',
      status: 'confirmed',
      proofHash: '0x91ad60d2e56f6c5b134bdaf8021cc5e32e10b922beac88a7fb0d440c1ef80017'
    },
    {
      id: 'log-016',
      date: 'May 30, 2026',
      time: '22:03 UTC',
      status: 'confirmed',
      proofHash: '0x25a63ca14a481aaf1e481923de7f27e625d8021aa889bbfb0d524d041b930b88'
    },
    {
      id: 'log-015',
      date: 'May 29, 2026',
      time: '19:42 UTC',
      status: 'missed',
      proofHash: '0x0000000000000000000000000000000000008021000000000000000000000000'
    },
    {
      id: 'log-014',
      date: 'May 28, 2026',
      time: '21:49 UTC',
      status: 'confirmed',
      proofHash: '0xf8ab1e23d1c67d930a2c972f3aa45e25db8021caae77bbdde8b424a61446f3d5'
    }
  ]
}

export const publicPromises = [
  {
    id: 'promise-8021',
    title: mockPromiseVault.title,
    status: 'confirmed' as PromiseStatus,
    streak: 18
  },
  {
    id: 'promise-1776',
    title: 'Publish one transparent build note daily',
    status: 'checked in' as PromiseStatus,
    streak: 9
  },
  {
    id: 'promise-4410',
    title: 'Review one customer signal before launch',
    status: 'ready' as PromiseStatus,
    streak: 6
  }
]
