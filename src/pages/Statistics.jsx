import React, { useState, useMemo } from 'react'
import { getWeightLog, getFoodForDate, getStepsForDate } from '../utils/storage'
import { useT } from '../i18n/context'

const DAY = 86400000

function lastDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * DAY)
    return d.toISOString().slice(0, 10)
  })
}

function MiniBar({ data, color, label, unit }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium">{data.reduce((s, d) => s + d.value, 0)} {unit}</span>
      </div>
      <div className="flex items-end gap-1 h-24">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-dark-700 rounded-t relative" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 0 }}>
              <div className="w-full h-full rounded-t transition-all" style={{ background: color, opacity: 0.7 }} />
            </div>
            <span className="text-[10px] text-gray-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Statistics() {
  const t = useT()
  const [period, setPeriod] = useState(7)
  const weightLog = getWeightLog()

  const days = useMemo(() => lastDays(period), [period])

  const weightData = useMemo(() => {
    const map = {}
    weightLog.forEach(w => { map[w.date] = w.weight })
    return days.map(d => ({ label: d.slice(5), value: map[d] || 0 }))
  }, [weightLog, days])

  const kcalData = useMemo(() => {
    return days.map(d => {
      const food = getFoodForDate(d)
      const kcal = food.reduce((s, f) => s + (Number(f.kcal) || 0), 0)
      return { label: d.slice(5), value: kcal }
    })
  }, [days])

  const stepsData = useMemo(() => {
    return days.map(d => ({ label: d.slice(5), value: getStepsForDate(d) }))
  }, [days])

  return (
    <div className="p-4 space-y-5">
      <h1 className="text-2xl font-bold text-gradient">{t('statistics.title')}</h1>

      <div className="flex gap-2">
        {[7, 14, 30].map(n => (
          <button key={n} onClick={() => setPeriod(n)}
            className={`flex-1 py-2 rounded-xl text-sm transition-all ${period === n ? 'bg-green-500 text-black shadow-lg shadow-green-500/30' : 'bg-dark-700 text-gray-400'}`}>
            {n} {t('statistics.days')}
          </button>
        ))}
      </div>

      <div className="card-gradient-border p-4 space-y-4">
        <h2 className="font-semibold">⚖️ {t('statistics.weight')}</h2>
        {weightData.some(d => d.value > 0) ? (
          <MiniBar data={weightData} color="#22c55e" label={t('statistics.weight')} unit={t('statistics.kg')} />
        ) : (
          <p className="text-sm text-gray-500">{t('statistics.noWeightData')}</p>
        )}
      </div>

      <div className="card-gradient-border p-4 space-y-4">
        <h2 className="font-semibold">🔥 {t('statistics.calories')}</h2>
        <MiniBar data={kcalData} color="#f97316" label={t('statistics.calories')} unit={t('statistics.kcal')} />
      </div>

      <div className="card-gradient-border p-4 space-y-4">
        <h2 className="font-semibold">👟 {t('statistics.steps')}</h2>
        <MiniBar data={stepsData} color="#3b82f6" label={t('statistics.steps')} unit={t('statistics.stepsUnit')} />
      </div>
    </div>
  )
}
