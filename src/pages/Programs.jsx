import React, { useState } from 'react'
import { useT } from '../i18n/context'
import { exercises, muscles } from '../data/exercises'
import { loadPrograms, savePrograms } from '../utils/storage'

export default function Programs() {
  const [programs, setPrograms] = useState(loadPrograms)
  const [showBuilder, setShowBuilder] = useState(false)
  const [newName, setNewName] = useState('')
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('')
  const t = useT()

  const persist = (p) => { setPrograms(p); savePrograms(p) }

  const createProgram = () => {
    if (!newName || selected.length === 0) return
    const updated = [...programs, { id: Date.now(), name: newName, exercises: selected }]
    persist(updated)
    setNewName('')
    setSelected([])
    setShowBuilder(false)
  }

  const deleteProgram = (id) => {
    persist(programs.filter(p => p.id !== id))
  }

  const toggleEx = (ex) => {
    setSelected(s => s.find(e => e.id === ex.id) ? s.filter(e => e.id !== ex.id) : [...s, ex])
  }

  if (showBuilder) {
    const filtered = filter ? exercises.filter(e => e.muscle === filter) : exercises
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowBuilder(false)} className="text-gray-400">←</button>
          <h1 className="text-xl font-bold">{t('programs.newProgram')}</h1>
        </div>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('programs.programName')}
          className="w-full bg-dark-800 rounded-xl px-4 py-3 text-sm" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setFilter('')} className={`shrink-0 px-3 py-2 rounded-xl text-xs ${!filter ? 'bg-green-500 text-black' : 'bg-dark-700'}`}>{t('programs.all')}</button>
          {muscles.map(m => (
            <button key={m} onClick={() => setFilter(m)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs ${filter === m ? 'bg-green-500 text-black' : 'bg-dark-700'}`}>{m}</button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map(ex => (
            <div key={ex.id} onClick={() => toggleEx(ex)}
              className={`bg-dark-800 rounded-xl p-3 flex items-center gap-3 active:scale-[0.98] transition-transform ${selected.find(e => e.id === ex.id) ? 'border border-green-500' : ''}`}>
              <span className="text-2xl">{ex.image}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{ex.name}</p>
                <p className="text-xs text-gray-400">{ex.muscle}</p>
              </div>
              {selected.find(e => e.id === ex.id) && <span className="text-green-400">✓</span>}
            </div>
          ))}
        </div>
        <button onClick={createProgram} className="w-full bg-green-500 text-black font-bold py-4 rounded-2xl">
          {t('programs.createBtn')} ({selected.length})
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('programs.title')}</h1>
        <button onClick={() => setShowBuilder(true)} className="bg-green-500 text-black font-bold px-4 py-2 rounded-xl text-sm">
          + {t('programs.create')}
        </button>
      </div>
      {programs.map(p => (
        <div key={p.id} className="bg-dark-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">{p.name}</h2>
            <button onClick={() => deleteProgram(p.id)} className="text-red-400 text-xs">{t('programs.delete')}</button>
          </div>
          {p.exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <span className="text-lg">{ex.image || '🏋️'}</span>
              <span className="text-sm">{ex.name}</span>
              <span className="text-xs text-gray-400 ml-auto">{ex.muscle}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
