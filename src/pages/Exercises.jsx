import React, { useState } from 'react'
import { useT } from '../i18n/context'
import { exercises, muscles } from '../data/exercises'
import VideoModal from '../components/VideoModal'
import { getFavorites, toggleFavorite } from '../utils/storage'

export default function Exercises() {
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [videoExercise, setVideoExercise] = useState(null)
  const [favorites, setFavorites] = useState(getFavorites)
  const t = useT()

  const handleToggle = (id) => {
    const updated = toggleFavorite(id)
    setFavorites(updated)
  }

  const filtered = exercises.filter(e => {
    if (filter === 'favorites' && !favorites.includes(e.id)) return false
    if (filter && filter !== 'favorites' && e.muscle !== filter) return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('exercises.title')}</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('exercises.search')}
        className="w-full bg-dark-800 rounded-xl px-4 py-3 text-sm" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('')} className={`shrink-0 px-4 py-2 rounded-xl text-xs ${!filter ? 'bg-green-500 text-black' : 'bg-dark-700'}`}>{t('exercises.all')}</button>
        <button onClick={() => setFilter('favorites')} className={`shrink-0 px-4 py-2 rounded-xl text-xs ${filter === 'favorites' ? 'bg-green-500 text-black' : 'bg-dark-700'}`}>⭐ {favorites.length}</button>
        {muscles.map(m => (
          <button key={m} onClick={() => setFilter(m)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs ${filter === m ? 'bg-green-500 text-black' : 'bg-dark-700'}`}>{m}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-dark-800 rounded-2xl p-4 text-center space-y-2 active:scale-95 transition-transform relative">
            <button onClick={() => handleToggle(ex.id)} className="absolute top-2 right-2 text-sm">
              {favorites.includes(ex.id) ? '⭐' : '☆'}
            </button>
            <span className="text-3xl">{ex.image}</span>
            <p className="font-medium text-sm">{ex.name}</p>
            <span className="text-xs text-gray-400 bg-dark-600 px-2 py-0.5 rounded-full">{ex.muscle}</span>
            <button onClick={() => setVideoExercise(ex)}
              className="w-full bg-dark-700 py-2 rounded-xl text-xs mt-1 active:scale-95 transition-transform">
              🎥 {t('exercises.showForm')}
            </button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-500 py-8">{t('exercises.notFound')}</p>}
      {videoExercise && <VideoModal exercise={videoExercise} onClose={() => setVideoExercise(null)} />}
    </div>
  )
}
