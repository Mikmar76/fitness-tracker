import React, { useState } from 'react'
import { useT } from '../i18n/context'
import { getMeasurements, saveMeasurement } from '../utils/storage'

export default function Measurements() {
  const [log, setLog] = useState(getMeasurements)
  const [form, setForm] = useState({ chest: '', waist: '', hips: '', arm: '' })
  const t = useT()

  const fields = [
    { key: 'chest', label: t('measurements.chest'), unit: 'см' },
    { key: 'waist', label: t('measurements.waist'), unit: 'см' },
    { key: 'hips', label: t('measurements.hips'), unit: 'см' },
    { key: 'arm', label: t('measurements.arm'), unit: 'см' },
  ]

  const add = () => {
    const hasAny = fields.some(f => form[f.key])
    if (!hasAny) return
    const updated = saveMeasurement(form)
    setLog(updated)
    setForm({ chest: '', waist: '', hips: '', arm: '' })
  }

  const latest = log.length > 0 ? log[log.length - 1] : null

  return (
    <div className="p-4 space-y-5">
      <h1 className="text-2xl font-bold">{t('measurements.title')}</h1>

      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">{t('measurements.new')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                inputMode="decimal" placeholder="0" className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
            </div>
          ))}
        </div>
        <button onClick={add} className="w-full bg-green-500 text-black font-bold py-3 rounded-xl text-sm">
          {t('measurements.record')}
        </button>
      </div>

      {latest && (
        <div className="bg-dark-800 rounded-2xl p-4 space-y-2">
          <h2 className="font-semibold">{t('measurements.last')}</h2>
          <p className="text-xs text-gray-500 mb-2">{latest.date}</p>
          {fields.map(f => latest[f.key] && (
            <div key={f.key} className="flex justify-between text-sm py-1 border-b border-dark-600 last:border-0">
              <span className="text-gray-400">{f.label}</span>
              <span className="font-medium">{latest[f.key]} {f.unit}</span>
            </div>
          ))}
        </div>
      )}

      {log.length > 1 && (
        <div className="bg-dark-800 rounded-2xl p-4 space-y-2">
          <h2 className="font-semibold">{t('measurements.history')}</h2>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {[...log].reverse().map((m, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-400 py-1 border-b border-dark-600 last:border-0">
                <span>{m.date}</span>
                <span className="text-white">
                  {fields.filter(f => m[f.key]).map(f => `${m[f.key]}${f.unit}`).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
