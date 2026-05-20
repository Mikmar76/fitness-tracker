import React, { useState, useRef, useEffect } from 'react'
import { useT } from '../i18n/context'

export default function Timer() {
  const t = useT()
  const PRESETS = [
    { name: t('timer.tabata'), work: 20, rest: 10, rounds: 8 },
    { name: t('timer.intervals30'), work: 30, rest: 30, rounds: 6 },
    { name: t('timer.intervals45'), work: 45, rest: 15, rounds: 6 },
    { name: t('timer.circuit'), work: 60, rest: 30, rounds: 4 },
  ]
  const [phase, setPhase] = useState('preset')
  const [work, setWork] = useState(20)
  const [rest, setRest] = useState(10)
  const [rounds, setRounds] = useState(8)

  const stateRef = useRef({ time: 20, isWork: true, round: 1, running: false, work: 20, rest: 10, rounds: 8 })
  const [display, setDisplay] = useState({ time: 20, isWork: true, round: 1, total: 8 })
  const intervalRef = useRef(null)

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    stateRef.current.running = false
  }

  const start = (w, r, rnd) => {
    setWork(w); setRest(r); setRounds(rnd)
    stateRef.current = { time: w, isWork: true, round: 1, running: true, work: w, rest: r, rounds: rnd }
    setDisplay({ time: w, isWork: true, round: 1, total: rnd })
    setPhase('active')

    clear()
    intervalRef.current = setInterval(() => {
      const s = stateRef.current
      s.time -= 1
      if (s.time <= 0) {
        if (s.isWork) {
          s.isWork = false
          s.time = s.rest
        } else {
          if (s.round >= s.rounds) {
            clear()
            setPhase('done')
            return
          }
          s.round += 1
          s.isWork = true
          s.time = s.work
        }
      }
      setDisplay({ time: s.time, isWork: s.isWork, round: s.round, total: s.rounds })
    }, 1000)
  }

  const stop = () => { clear(); setPhase('preset') }

  useEffect(() => () => clear(), [])

  if (phase === 'preset') {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">{t('timer.title')}</h1>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => start(p.work, p.rest, p.rounds)}
              className="bg-dark-800 rounded-2xl p-4 text-left space-y-1 active:scale-95 transition-transform">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-400">{p.rounds} {t('timer.rounds')}</p>
            </button>
          ))}
        </div>

        <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
          <h2 className="font-semibold">{t('timer.custom')}</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">{t('timer.work')}</label>
              <input value={work} onChange={e => setWork(+e.target.value)} inputMode="numeric"
                className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">{t('timer.rest')}</label>
              <input value={rest} onChange={e => setRest(+e.target.value)} inputMode="numeric"
                className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">{t('timer.roundsLabel')}</label>
              <input value={rounds} onChange={e => setRounds(+e.target.value)} inputMode="numeric"
                className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
            </div>
          </div>
          <button onClick={() => start(work, rest, rounds)} className="w-full bg-green-500 text-black font-bold py-3 rounded-xl text-sm">
            {t('timer.start')}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="p-4 text-center space-y-4 pt-16">
        <span className="text-6xl">🎉</span>
        <h1 className="text-2xl font-bold">{t('timer.completed')}</h1>
        <button onClick={() => setPhase('preset')} className="bg-dark-700 px-8 py-3 rounded-xl text-sm">
          {t('timer.back')}
        </button>
      </div>
    )
  }

  const total = display.isWork ? stateRef.current.work : stateRef.current.rest
  const progress = total > 0 ? 1 - display.time / total : 0
  const circle = 2 * Math.PI * 85
  const offset = circle * progress

  return (
    <div className="p-4 space-y-4 text-center">
      <button onClick={stop} className="text-gray-400 text-sm float-left">← {t('timer.back')}</button>
      <div className="pt-8">
        <span className="text-sm text-gray-400">{display.isWork ? t('timer.workPhase') : t('timer.restPhase')}</span>
        <div className="flex justify-center my-6">
          <div className="relative">
            <svg width="200" height="200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#2e2e3d" strokeWidth="10" />
              <circle cx="100" cy="100" r="85" fill="none" stroke={display.isWork ? '#22c55e' : '#f97316'} strokeWidth="10"
                strokeDasharray={circle} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold">{display.time}</span>
          </div>
        </div>
        <p className="text-lg font-semibold">{t('timer.round')} {display.round} / {display.total}</p>
        <button onClick={stop} className="mt-6 bg-red-500/20 text-red-400 px-6 py-2 rounded-xl text-sm">
          {t('timer.stop')}
        </button>
      </div>
    </div>
  )
}
