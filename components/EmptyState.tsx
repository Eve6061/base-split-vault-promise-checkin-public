import { ShieldAlert } from 'lucide-react'

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <section className="empty-state">
      <ShieldAlert size={22} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{detail}</p>
    </section>
  )
}
