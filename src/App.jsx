import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import useSwipe from './utils/useSwipe'
import Onboarding from './components/Onboarding'
import Splash from './components/Splash'
import PageTransition from './components/PageTransition'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import Nutrition from './pages/Nutrition'
import Calendar from './pages/Calendar'
import AIChat from './pages/AIChat'
import Programs from './pages/Programs'
import Exercises from './pages/Exercises'
import Statistics from './pages/Statistics'
import Profile from './pages/Profile'
import WorkoutHistory from './pages/WorkoutHistory'
import Measurements from './pages/Measurements'
import Timer from './pages/Timer'
import InstallPWA from './components/InstallPWA'
import { ToastProvider } from './components/Toast'
import Button from './components/Button'
import { loadUser, saveUser } from './utils/storage'

export default function App() {
  const [user, setUser] = useState(() => loadUser())
  const [splash, setSplash] = useState(true)
  const [step, setStep] = useState(() => {
    if (!user) { const s = localStorage.getItem('fittrack_onboarding_done'); return s ? 'register' : 'onboarding' }
    return 'app'
  })

  const handleRegister = (data) => {
    const u = { ...data, registered: true }
    setUser(u)
    saveUser(u)
    setStep('app')
  }

  useSwipe()

  if (splash) {
    return <Splash onFinish={() => setSplash(false)} />
  }

  if (step === 'onboarding') {
    return <Onboarding onDone={() => { localStorage.setItem('fittrack_onboarding_done', '1'); setStep('register') }} />
  }

  if (step === 'register') {
    return <RegistrationForm onRegister={handleRegister} />
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen pb-20 bg-dark-900 relative noise">
      <ToastProvider>
        <Routes>
          <Route path="/" element={<PageTransition><Dashboard user={user} /></PageTransition>} />
          <Route path="/workout" element={<PageTransition><Workout /></PageTransition>} />
          <Route path="/nutrition" element={<PageTransition><Nutrition /></PageTransition>} />
          <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
          <Route path="/chat" element={<PageTransition><AIChat /></PageTransition>} />
          <Route path="/programs" element={<PageTransition><Programs /></PageTransition>} />
          <Route path="/exercises" element={<PageTransition><Exercises /></PageTransition>} />
          <Route path="/statistics" element={<PageTransition><Statistics /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/history" element={<PageTransition><WorkoutHistory /></PageTransition>} />
          <Route path="/measurements" element={<PageTransition><Measurements /></PageTransition>} />
          <Route path="/timer" element={<PageTransition><Timer /></PageTransition>} />
        </Routes>
        <InstallPWA />
        <BottomNav />
      </ToastProvider>
    </div>
  )
}

function RegistrationForm({ onRegister }) {
  const [form, setForm] = useState({ name: '', weight: '', height: '', goal: 'support' })
  const valid = form.name.trim() && form.weight && form.height

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6 animate-slide-up">
        <h1 className="text-3xl font-bold text-center text-gradient">Регистрация</h1>
        <p className="text-gray-400 text-center">Заполни данные для персонализации</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Имя</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Твоё имя" className="w-full bg-dark-800 rounded-xl px-4 py-3 text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Вес, кг</label>
              <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
                inputMode="decimal" placeholder="70" className="w-full bg-dark-800 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Рост, см</label>
              <input value={form.height} onChange={e => setForm({ ...form, height: e.target.value })}
                inputMode="numeric" placeholder="175" className="w-full bg-dark-800 rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Цель</label>
            <div className="flex gap-2">
              {[
                { value: 'lose', label: 'Похудение', emoji: '🔥', cls: 'shadow-orange-500/30' },
                { value: 'gain', label: 'Набор массы', emoji: '💪', cls: 'shadow-green-500/30' },
                { value: 'support', label: 'Поддержание', emoji: '⚖️', cls: 'shadow-blue-500/30' },
              ].map(o => {
                const isActive = form.goal === o.value
                return (
                  <button key={o.value} onClick={() => setForm({ ...form, goal: o.value })}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-all duration-200 ${isActive ? 'scale-105 shadow-lg ' + o.cls + ' text-black' : 'bg-dark-800 text-gray-400'} ${isActive && o.value === 'lose' ? 'bg-gradient-to-br from-orange-500 to-red-500' : ''}${isActive && o.value === 'gain' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : ''}${isActive && o.value === 'support' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : ''}`}>
                    <span className="text-lg">{o.emoji}</span>
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Button onClick={() => onRegister(form)} disabled={!valid} className="w-full text-lg py-4">
          Готово
        </Button>
      </div>
    </div>
  )
}
