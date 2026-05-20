import React, { useState } from 'react'
import { useT } from '../i18n/context'

export default function Calendar() {
  const t = useT()

  const workouts = {
    '2026-05-14': { name: t('calendar.defaultChest'), duration: '45 мин', done: true },
    '2026-05-12': { name: t('calendar.defaultLegs'), duration: '50 мин', done: true },
    '2026-05-10': { name: t('calendar.defaultBack'), duration: '40 мин', done: true },
    '2026-05-15': { name: t('calendar.defaultLegs'), duration: '50 мин', done: false },
    '2026-05-17': { name: t('calendar.defaultBack'), duration: '40 мин', done: false },
  }

  const days = [t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat'), t('calendar.sun')]

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const first = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = first === 0 ? 6 : first - 1

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const fmt = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const today = fmt(now.getDate())

  const monthNames = t('calendar.months')

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('calendar.title')}</h1>

      <div className="bg-dark-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prev} className="text-gray-400 text-xl px-2">‹</button>
          <span className="font-semibold">{monthNames[month]} {year}</span>
          <button onClick={next} className="text-gray-400 text-xl px-2">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {days.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const key = fmt(d)
            const w = workouts[key]
            const isToday = key === today
            return (
              <div key={d}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative ${isToday ? 'bg-green-500/20 border border-green-500' : ''}`}>
                <span className={isToday ? 'text-green-400 font-bold' : ''}>{d}</span>
                {w && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${w.done ? 'bg-green-400' : 'bg-orange-400'}`} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-sm text-gray-400">{t('calendar.workoutsThisMonth')}</h2>
        {Object.entries(workouts).map(([date, w]) => {
          const d = new Date(date)
          return (
            <div key={date} className="bg-dark-800 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-xs text-gray-400">{d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · {w.duration}</p>
              </div>
              <span className={`text-sm ${w.done ? 'text-green-400' : 'text-orange-400'}`}>
                {w.done ? `✓ ${t('calendar.completed')}` : `○ ${t('calendar.planned')}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
