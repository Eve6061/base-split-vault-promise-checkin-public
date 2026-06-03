'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, ClipboardCheck, FileClock, Gauge, ShieldCheck } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Vault', icon: ShieldCheck },
  { href: '/checkin', label: 'Check In', icon: ClipboardCheck },
  { href: '/promise/promise-8021', label: 'Proof', icon: Gauge },
  { href: '/my', label: 'My Promise', icon: Activity },
  { href: '/log', label: 'Log', icon: FileClock }
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href.startsWith('/promise')) return pathname.startsWith('/promise')
  return pathname === href
}

export function TopTabs() {
  const pathname = usePathname()

  return (
    <nav className="top-tabs" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(pathname, tab.href)
        return (
          <Link className={active ? 'active' : ''} href={tab.href} key={tab.href}>
            <Icon size={16} aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
