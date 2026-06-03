import { Flame, Gauge } from 'lucide-react'

export function StreakMeter({ streak }: { streak: number }) {
  const segments = Array.from({ length: 10 }, (_, index) => index < Math.min(10, Math.ceil(streak / 2)))

  return (
    <section className="streak-meter" aria-label="Current streak meter">
      <div className="meter-head">
        <Gauge size={18} aria-hidden="true" />
        <span>Current Streak</span>
      </div>
      <div className="streak-number">
        <Flame size={28} aria-hidden="true" />
        <strong>{streak}</strong>
        <span>days</span>
      </div>
      <div className="meter-bars">
        {segments.map((active, index) => (
          <i className={active ? 'filled' : ''} key={index} />
        ))}
      </div>
    </section>
  )
}
