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
