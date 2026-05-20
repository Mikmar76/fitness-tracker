import React, { useState, useEffect, useRef } from 'react'
import { exercises } from '../data/exercises'
import { loadWorkouts, saveWorkouts } from '../utils/storage'
import { updateStreak, unlock } from '../utils/achievements'
import { haptic } from '../utils/haptic'
import Confetti from '../components/Confetti'
import Button from '../components/Button'
import { useToast } from '../components/Toast'
import { useT } from '../i18n/context'

export default function Workout() {
  const t = useT()
  const [phase, setPhase] = useState('start')
  const [current, setCurrent] = useState(0)
  const [rest, setRest] = useState(30)
  const [sets, setSets] = useState([{ weight: '', reps: '' }])
  const [showConfetti, setShowConfetti] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const timerRef = useRef(null)
  const [program] = useState(exercises.slice(0, 4))
  const toast = useToast()

  useEffect(() => {
    if (phase === 'rest' && rest > 0) {
      timerRef.current = setTimeout(() => setRest(r => r - 1), 1000)
    } else if (phase === 'rest' && rest === 0) {
      haptic([100, 50, 100])
      setPhase('active')
      if (current < program.length - 1) setCurrent(c => c + 1)
      else setPhase('done')
    }
    return () => clearTimeout(timerRef.current)
  }, [phase, rest, current, program.length])

  const startWorkout = () => {
    haptic()
    setPhase('active')
    setCurrent(0)
    setSets([{ weight: '', reps: '' }])
  }

  const finishSet = () => {
    haptic()
    setSets(s => [...s, { weight: '', reps: '' }])
    setRest(30)
    setPhase('rest')
  }

  const finishWorkout = () => {
    haptic([50, 50, 100, 50, 150])
    const completedSets = sets.filter(s => s.weight && s.reps)
    const w = {
      date: new Date().toISOString(),
      name: program.map(e => e.name).join(', '),
      duration: '~30 мин',
      exercises: program.map((ex, i) => ({
        name: ex.name,
        sets: completedSets.filter((_, si) => si === i || (completedSets.length === 1 && i === 0)).length > 0
          ? [{ weight: sets[i]?.weight || '', reps: sets[i]?.reps || '' }]
          : []
      }))
    }
    const ws = loadWorkouts()
    ws.push(w)
    saveWorkouts(ws)

    const total = ws.length
    const newStreak = updateStreak()
    if (total === 1 && unlock('first_workout').includes('first_workout')) toast(`🎯 ${t('workout.firstWorkout')}`, 'achievement', 5000)
    if (total === 10 && unlock('10_workouts').includes('10_workouts')) toast(`🥈 ${t('workout.disciplined')}`, 'achievement', 5000)
    if (total === 50 && unlock('50_workouts').includes('50_workouts')) toast(`🥇 ${t('workout.machine')}`, 'achievement', 5000)
    if (total === 100 && unlock('100_workouts').includes('100_workouts')) toast(`🏆 ${t('workout.hundred')}`, 'achievement', 6000)
    if (newStreak.count === 7) toast(`🔥 ${t('workout.weekStreak')}`, 'streak', 5000)
    if (newStreak.count === 30) toast(`💎 30 ${t('statistics.days')}!`, 'streak', 6000)
    toast(`💪 ${t('workout.saved')}`, 'workout')

    setShowConfetti(true)
    setPhase('done')
  }

  const handleDragStart = (idx) => setDragIdx(idx)
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) return
    const s = [...sets]
    const [moved] = s.splice(dragIdx, 1)
    s.splice(idx, 0, moved)
    setSets(s)
    setDragIdx(null)
  }

  if (phase === 'start') return (
    <div className="p-4 space-y-4 pt-8">
      <h1 className="text-2xl font-bold text-gradient">{t('workout.title')}</h1>
      <div className="glass rounded-2xl p-6 text-center space-y-2">
        <span className="text-5xl block animate-bounce">💪</span>
        <p className="text-gray-400 text-sm">{t('workout.ready')}</p>
      </div>
      <Button onClick={startWorkout} variant="neon" className="w-full text-lg py-4">
        {t('workout.start')}
      </Button>
    </div>
  )

  if (phase === 'done') return (
    <>
      <Confetti active={showConfetti} />
      <div className="p-4 space-y-4 pt-8 text-center animate-slide-up">
        <span className="text-5xl">🎉</span>
        <h1 className="text-2xl font-bold">{t('workout.completed')}</h1>
        <p className="text-gray-400">{t('workout.wellDone')} 🔥</p>
        <Button onClick={startWorkout} variant="glass" className="w-full py-4">
          {t('workout.restart')}
        </Button>
      </div>
    </>
  )

  if (phase === 'rest') return (
    <div className="p-4 space-y-4 pt-8 text-center">
      <h1 className="text-xl font-bold">{t('workout.rest')}</h1>
      <div className="flex justify-center my-8">
        <div className="relative">
          <svg width="200" height="200">
            <circle cx="100" cy="100" r="85" fill="none" stroke="#2e2e3d" strokeWidth="10" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="#f97316" strokeWidth="10"
              strokeDasharray={2 * Math.PI * 85} strokeDashoffset={2 * Math.PI * 85 * (1 - rest / 30)}
              strokeLinecap="round" className="-rotate-90 origin-center"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold">{rest}</span>
        </div>
      </div>
      <p className="text-gray-400">Следующее: {program[current]?.name}</p>
    </div>
  )

  const ex = program[current]
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('workout.title')}</h1>
        <span className="text-sm text-gray-400">{current + 1}/{program.length}</span>
      </div>
      <div className="glass rounded-2xl p-5 text-center animate-slide-up">
        <span className="text-4xl">{ex.image}</span>
        <h2 className="text-xl font-bold mt-2">{ex.name}</h2>
        <p className="text-gray-400 text-sm">{ex.desc}</p>
      </div>
      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <div className="flex gap-3">
          <input type="text" inputMode="decimal" placeholder={t('workout.weight')} value={sets[sets.length - 1]?.weight || ''}
            onChange={e => { const s = [...sets]; s[s.length - 1] = { ...s[s.length - 1], weight: e.target.value }; setSets(s) }}
            className="w-1/2 bg-dark-700 rounded-xl px-4 py-3 text-center text-lg" />
          <input type="text" inputMode="numeric" placeholder={t('workout.reps')} value={sets[sets.length - 1]?.reps || ''}
            onChange={e => { const s = [...sets]; s[s.length - 1] = { ...s[s.length - 1], reps: e.target.value }; setSets(s) }}
            className="w-1/2 bg-dark-700 rounded-xl px-4 py-3 text-center text-lg" />
        </div>
        <div className="flex gap-3">
          <Button onClick={finishWorkout} variant="glass" className="flex-1 text-sm py-3">{t('workout.finish')}</Button>
          <Button onClick={finishSet} variant="neon" className="flex-1 text-sm py-3">{t('workout.done')}</Button>
        </div>
      </div>
      <div className="bg-dark-800 rounded-2xl p-4">
        <h3 className="text-sm text-gray-400 mb-2">{t('workout.setsCompleted')} {sets.length - 1}</h3>
        {sets.slice(0, -1).map((s, i) => (
          <div key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(i)}
            className={`flex justify-between text-sm py-2 px-2 border-b border-dark-600 last:border-0 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${dragIdx === i ? 'bg-green-500/10 border-green-500/30' : ''}`}>
            <span>{t('workout.set')} {i + 1}</span>
            <span>{s.weight} кг × {s.reps}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
