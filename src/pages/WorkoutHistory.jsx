import React from 'react'
import { useT } from '../i18n/context'
import { loadWorkouts } from '../utils/storage'

export default function WorkoutHistory() {
  const t = useT()
  const workouts = loadWorkouts()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('history.title')}</h1>

      {workouts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl">🏋️</span>
          <p className="mt-2">{t('history.empty')}</p>
          <p className="text-sm">{t('history.emptyHint')}</p>
        </div>
      ) : (
        [...workouts].reverse().map((w, i) => (
          <div key={i} className="bg-dark-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{w.name || t('history.workout')}</h3>
              <span className="text-xs text-gray-400">{w.duration || '~30 мин'}</span>
            </div>
            <p className="text-xs text-gray-500">{new Date(w.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
            {w.exercises && w.exercises.map((ex, ei) => (
              <div key={ei} className="flex justify-between text-sm py-1 border-b border-dark-600 last:border-0">
                <span className="text-gray-300">{ex.name}</span>
                <span className="text-gray-500">{ex.sets?.length || 0} подходов</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
