import { ReactNode } from 'react'

export function StatusFrame({
  label,
  value,
  detail,
  children
}: {
  label: string
  value: string
  detail?: string
  children?: ReactNode
}) {
  return (
    <section className="status-frame">
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <span>{detail}</span> : null}
      {children}
    </section>
  )
}
