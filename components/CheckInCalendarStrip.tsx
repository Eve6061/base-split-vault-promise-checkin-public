import { Check, Minus } from 'lucide-react'

const days = [
  { label: 'Thu', state: 'confirmed' },
  { label: 'Fri', state: 'missed' },
  { label: 'Sat', state: 'confirmed' },
  { label: 'Sun', state: 'confirmed' },
  { label: 'Mon', state: 'confirmed' },
  { label: 'Tue', state: 'ready' }
]

export function CheckInCalendarStrip() {
  return (
    <div className="calendar-strip" aria-label="Recent check-in strip">
      {days.map((day) => (
        <div className={day.state} key={day.label}>
          <span>{day.label}</span>
          {day.state === 'missed' ? <Minus size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}
