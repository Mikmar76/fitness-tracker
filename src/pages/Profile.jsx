import React, { useState } from 'react'
import { loadUser, getWeightLog, addWeightLog, clearAllData, saveUser } from '../utils/storage'
import { getAchievementsDef, getUnlocked } from '../utils/achievements'
import { haptic } from '../utils/haptic'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { useT, useLanguage } from '../i18n/context'

export default function Profile() {
  const t = useT()
  const { lang, setLang } = useLanguage()
  const [user, setUser] = useState(() => loadUser() || { name: '', weight: '', height: '', goal: 'support' })
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ ...user })
  const [weightInput, setWeightInput] = useState('')
  const [weightLog] = useState(getWeightLog)
  const [notifEnabled, setNotifEnabled] = useState(Notification.permission === 'granted')

  const achievements = getAchievementsDef()
  const unlocked = getUnlocked()

  const saveProfile = () => {
    const u = { ...form, registered: true }
    setUser(u)
    saveUser(u)
    setEdit(false)
    haptic()
  }

  const logWeight = () => {
    if (!weightInput) return
    addWeightLog(weightInput)
    setWeightInput('')
    haptic()
  }

  const handleClear = () => {
    if (window.confirm(t('profile.deleteAllData'))) {
      clearAllData()
      window.location.reload()
    }
  }

  const requestNotif = async () => {
    const perm = await Notification.requestPermission()
    setNotifEnabled(perm === 'granted')
    if (perm === 'granted') {
      new Notification('FitTrack', { body: t('profile.enabled'), icon: '/vite.svg' })
    }
  }

  return (
    <div className="p-4 space-y-4 animate-slide-up">
      <h1 className="text-2xl font-bold text-gradient">{t('profile.title')}</h1>

      <div className="glass rounded-2xl p-5 text-center space-y-3">
        <Avatar name={user.name || t('profile.athlete')} size="text-6xl" className="mx-auto ring-4 ring-green-500/20" />
        <h2 className="text-xl font-bold">{user.name || t('profile.athlete')}</h2>
        <p className="text-gray-400 text-sm">
          {user.weight} кг · {user.height} см · {({ lose: t('profile.weightLoss'), gain: t('profile.bulk'), support: t('profile.maintenance') })[user.goal]}
        </p>
      </div>

      {edit ? (
        <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('profile.name')}</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-700 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">{t('profile.weight')}</label>
              <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
                inputMode="decimal" className="w-full bg-dark-700 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">{t('profile.height')}</label>
              <input value={form.height} onChange={e => setForm({ ...form, height: e.target.value })}
                inputMode="numeric" className="w-full bg-dark-700 rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>
          <label className="text-xs text-gray-400 mb-1 block">{t('profile.goal')}</label>
          <div className="flex gap-2 mb-3">
              {[
              { value: 'lose', label: `🔥 ${t('profile.weightLoss')}`, cls: 'from-orange-500 to-red-500' },
              { value: 'gain', label: `💪 ${t('profile.bulk')}`, cls: 'from-green-500 to-emerald-600' },
              { value: 'support', label: `⚖️ ${t('profile.maintenance')}`, cls: 'from-blue-500 to-cyan-500' },
            ].map(o => (
              <button key={o.value} onClick={() => setForm({ ...form, goal: o.value })}
                className={`flex-1 py-2 rounded-xl text-xs transition-all ${form.goal === o.value ? 'bg-gradient-to-br ' + o.cls + ' text-white shadow-lg' : 'bg-dark-700 text-gray-400'}`}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setEdit(false)} variant="glass" className="flex-1 text-sm py-2.5">{t('aichat.cancel')}</Button>
            <Button onClick={saveProfile} variant="neon" className="flex-1 text-sm py-2.5">{t('aichat.save')}</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setEdit(true)} variant="glass" className="w-full text-sm py-3">✏️ {t('profile.edit')}</Button>
      )}

      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">⚖️ {t('profile.weightLog')}</h2>
        <div className="flex gap-2">
          <input value={weightInput} onChange={e => setWeightInput(e.target.value)}
            inputMode="decimal" placeholder={t('profile.weight')} className="flex-1 bg-dark-700 rounded-xl px-4 py-2.5 text-sm" />
          <Button onClick={logWeight} variant="primary" className="px-6 text-sm">OK</Button>
        </div>
        {weightLog.length > 0 && (
          <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
            {weightLog.slice(-5).reverse().map((w, i) => (
              <span key={i} className="bg-dark-700 px-2 py-1 rounded">{w.weight} кг <span className="text-gray-500">{w.date.slice(5)}</span></span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">🌐 {t('profile.language')}</h2>
          <p className="text-xs text-gray-400">English / Русский</p>
        </div>
        <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
          className="bg-dark-700 px-4 py-2 rounded-xl text-sm font-medium active:scale-95 transition-transform">
          {lang === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
        </button>
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 space-y-2">
        <h2 className="font-semibold">🏆 {t('profile.achievements')}</h2>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map(a => {
            const has = unlocked.includes(a.id)
            const keys = { first_workout: 'first', week_streak: 'week', month_streak: 'marathon', '100_workouts': 'hundred', '50_workouts': 'fifty', '10_workouts': 'discipline', water_goal: 'water', steps_goal: 'walker' }
            return (
              <div key={a.id} className={`flex flex-col items-center p-2 rounded-xl transition-all ${has ? 'bg-green-500/10 scale-105' : 'bg-dark-700 opacity-40'}`}>
                <span className="text-xl">{has ? a.icon : '🔒'}</span>
                <span className="text-[8px] text-center mt-1 text-gray-400">{t(`achievements.${keys[a.id]}`)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">🔔 {t('profile.notifications')}</h2>
          <p className="text-xs text-gray-400">{t('profile.workoutReminders')}</p>
        </div>
        <Button onClick={requestNotif} variant={notifEnabled ? 'primary' : 'glass'} className="px-4 text-sm py-2">
          {notifEnabled ? t('profile.on') : t('profile.enable')}
        </Button>
      </div>

      <Button onClick={handleClear} variant="danger" className="w-full text-sm py-3">🗑️ {t('profile.resetData')}</Button>
    </div>
  )
}
