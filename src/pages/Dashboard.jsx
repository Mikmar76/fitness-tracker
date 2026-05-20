import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressRing from '../components/ProgressRing'
import { getFood, getWater, addWater, getSteps, saveSteps, loadUser } from '../utils/storage'
import { getStreak } from '../utils/achievements'
import Button from '../components/Button'
import { useT } from '../i18n/context'

export default function Dashboard({ user }) {
  const t = useT()
  const u = user || loadUser()
  const [water, setWater] = useState(getWater())
  const [steps, setSteps] = useState(getSteps())
  const [stepsInput, setStepsInput] = useState('')
  const [food] = useState(getFood)
  const [streak] = useState(getStreak)

  const totalKcal = food.reduce((s, i) => s + (Number(i.kcal) || 0), 0)
  const kcalGoal = 2100

  const addWaterHandler = () => {
    const val = addWater(0.2)
    setWater(val)
  }

  const setStepsHandler = () => {
    const v = parseInt(stepsInput)
    if (v > 0) { saveSteps(v); setSteps(v); setStepsInput('') }
  }

  const rings = [
    { label: t('dashboard.calories'), progress: Math.min(100, (totalKcal / kcalGoal) * 100), value: String(Math.round(totalKcal)), unit: t('statistics.kcal'), color: '#f97316' },
    { label: t('dashboard.steps'), progress: Math.min(100, (steps / 10000) * 100), value: String(steps), unit: t('statistics.stepsUnit'), color: '#22c55e' },
    { label: t('dashboard.strength'), progress: 40, value: '2', unit: t('statistics.days'), color: '#3b82f6' },
    { label: t('dashboard.water'), progress: Math.min(100, (water / 2.5) * 100), value: String(water.toFixed(1)), unit: 'л', color: '#a855f7' },
  ]

  return (
    <div className="p-4 space-y-5">
      <header className="pt-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.greeting')}, {u?.name || t('profile.athlete')}! 👋</h1>
          <p className="text-gray-400 text-sm">{t('dashboard.today')}, {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {streak.count > 0 && (
          <div className="flex items-center gap-1 bg-dark-800 rounded-xl px-3 py-2 animate-streak-fire">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-orange-400">{streak.count}</span>
            <span className="text-[10px] text-gray-400">{t('statistics.days')}</span>
          </div>
        )}
      </header>

      <div className="card-gradient-border p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">{t('dashboard.rings')}</span>
          <span className="text-green-400 text-xs">{t('dashboard.today')}</span>
        </div>
        <div className="flex justify-around">
          {rings.map(s => (
            <div key={s.label} className="relative flex flex-col items-center">
              <ProgressRing progress={s.progress} size={70} stroke={5} color={s.color} value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">🚰 {t('dashboard.water')}</h2>
          <span className="text-sm text-gray-400">{water.toFixed(1)} / 2.5 л</span>
        </div>
        <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${Math.min(100, (water / 2.5) * 100)}%` }} />
        </div>
        <Button onClick={addWaterHandler} variant="purple" className="w-full text-sm py-2.5">+ 0.2 л</Button>
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">👟 {t('dashboard.steps')}</h2>
          <span className="text-sm text-gray-400">{steps} / 10,000</span>
        </div>
        <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }} />
        </div>
        <div className="flex gap-2">
          <input value={stepsInput} onChange={e => setStepsInput(e.target.value)} inputMode="numeric" placeholder={t('dashboard.enterSteps')}
            className="flex-1 bg-dark-700 rounded-xl px-4 py-2.5 text-sm" />
          <Button onClick={setStepsHandler} variant="primary" className="px-6 text-sm">OK</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickCard to="/workout" emoji="💪" title={t('dashboard.quickWorkout')} subtitle={t('workout.start')} />
        <QuickCard to="/nutrition" emoji="🥗" title={t('dashboard.quickNutrition')} subtitle={t('nutrition.add')} />
        <QuickCard to="/programs" emoji="📋" title={t('dashboard.quickPrograms')} subtitle={t('programs.create')} />
        <QuickCard to="/exercises" emoji="🏋️" title={t('dashboard.quickExercises')} subtitle={t('common.all')} />
      </div>

      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">{t('dashboard.more')}</h2>
        <div className="grid grid-cols-3 gap-2">
          <MiniCard to="/statistics" emoji="📊" label={t('dashboard.statistics')} />
          <MiniCard to="/history" emoji="📜" label={t('dashboard.history')} />
          <MiniCard to="/measurements" emoji="📏" label={t('dashboard.measurements')} />
          <MiniCard to="/timer" emoji="⏱️" label={t('dashboard.timer')} />
          <MiniCard to="/profile" emoji="👤" label={t('dashboard.profile')} />
          <MiniCard to="/chat" emoji="🤖" label="AI" />
        </div>
      </div>

      <div className="card-gradient-border p-4 space-y-3">
        <h2 className="font-semibold">{t('dashboard.lastWorkout')}</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Грудь + Трицепс</span>
          <span className="text-green-400">45 мин</span>
        </div>
        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Выполнено: 8/10 подходов</span>
          <Link to="/workout" className="text-green-400">{t('dashboard.continue')}</Link>
        </div>
      </div>

      <div className="card-gradient-border p-4 text-white" style={{background:'linear-gradient(135deg, #22c55e22, #3b82f622)'}}>
        <h2 className="font-semibold mb-2">🤖 AI-{t('dashboard.statistics')}</h2>
        <p className="text-sm opacity-90">Попробуй добавить 10 мин кардио после каждой силовой тренировки для ускорения жиросжигания.</p>
        <Link to="/chat" className="text-white font-medium text-xs mt-2 inline-block opacity-80 hover:opacity-100">{t('dashboard.askAI')} →</Link>
      </div>
    </div>
  )
}

function QuickCard({ to, emoji, title, subtitle }) {
  return (
    <Link to={to} className="group bg-dark-800 rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10 hover:bg-dark-700">
      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
      <span className="font-semibold text-sm group-hover:text-green-400 transition-colors">{title}</span>
      <span className="text-xs text-gray-400">{subtitle}</span>
    </Link>
  )
}

function MiniCard({ to, emoji, label }) {
  return (
    <Link to={to} className="group bg-dark-700 rounded-xl p-3 flex flex-col items-center gap-1 active:scale-95 transition-all duration-200 hover:bg-dark-600 hover:shadow-lg hover:shadow-purple-500/10">
      <span className="text-lg group-hover:scale-110 transition-transform duration-200">{emoji}</span>
      <span className="text-[10px] text-gray-400 group-hover:text-purple-400 transition-colors">{label}</span>
    </Link>
  )
}
