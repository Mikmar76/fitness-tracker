import React, { useState, useRef, useEffect } from 'react'
import { load, save } from '../utils/storage'
import { useT, useLanguage } from '../i18n/context'

const SYSTEM_RU = `Ты профессиональный фитнес-тренер и диетолог. Отвечай кратко, по делу, на русском. 
Давай конкретные советы по тренировкам, питанию, восстановлению. 
Используй цифры (веса, подходы, повторения, ккал). 
Если спрашивают не про фитнес — вежливо возвращай к теме.`

const SYSTEM_EN = `You are a professional fitness trainer and nutritionist. Answer concisely in English.
Give specific advice on workouts, nutrition, and recovery.
Use numbers (weights, sets, reps, kcal).
If asked about non-fitness topics, politely steer back to the subject.`

const STORAGE_KEY = 'gemini_key'

export default function AIChat() {
  const t = useT()
  const { lang } = useLanguage()
  const [apiKey, setApiKey] = useState(() => load(STORAGE_KEY, ''))
  const [keyInput, setKeyInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: '__greeting__' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const [showKeyInput, setShowKeyInput] = useState(false)

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])

  const saveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim())
      save(STORAGE_KEY, keyInput.trim())
      setKeyInput('')
      setShowKeyInput(false)
    }
  }

  const clearKey = () => {
    setApiKey('')
    save(STORAGE_KEY, '')
  }

  const send = async () => {
    if (!input.trim() || loading || !apiKey) return
    const msg = input.trim()
    setInput('')
    const userMsg = { role: 'user', text: msg }
    setMessages(m => [...m, userMsg])
    setLoading(true)

    const history = messages.slice(-10).map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }))

    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
    const listData = await listRes.json()
    const models = (listData?.models || []).filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    const modelName = models[0]?.name?.replace('models/', '') || 'gemini-2.0-flash'

    let reply = null
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...history,
            { role: 'user', parts: [{ text: `${lang === 'ru' ? SYSTEM_RU : SYSTEM_EN}\n\n${msg}` }] }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        })
      })
      const data = await res.json()
      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reply) reply = `❌ ${res.status} ${data?.error?.message || JSON.stringify(data)}`
    } catch (e) { reply = `❌ ${t('aichat.errorNetwork')}: ${e.message}` }
    setMessages(m => [...m, { role: 'ai', text: reply }])
    setLoading(false)
  }

  if (!apiKey) {
    return (
      <div className="p-4 space-y-4 pt-8">
        <h1 className="text-2xl font-bold text-gradient">{t('aichat.title')}</h1>
        <div className="glass rounded-2xl p-6 text-center space-y-4">
          <span className="text-5xl block">🤖</span>
          <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: t('aichat.apiSetup') }} />

          <div className="space-y-2 text-left">
            <p className="text-xs text-gray-400" dangerouslySetInnerHTML={{ __html: t('aichat.step1') }} />
            <p className="text-xs text-gray-400">{t('aichat.step2')}</p>
            <p className="text-xs text-gray-400">{t('aichat.step3')}</p>
          </div>

          <input value={keyInput} onChange={e => setKeyInput(e.target.value)}
            placeholder={t('aichat.apiKeyPlaceholder')} className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center font-mono" />
          <Button onClick={saveKey} disabled={!keyInput.trim()} className="w-full text-sm py-3">{t('aichat.connect')}</Button>
        </div>
      </div>
    )
  }

  if (showKeyInput) {
    return (
      <div className="p-4 space-y-4 pt-8">
        <h1 className="text-2xl font-bold text-gradient">{t('aichat.title')}</h1>
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-sm text-gray-400">{t('aichat.currentKey')} <span className="text-green-400 font-mono text-xs">{apiKey.slice(0, 8)}...</span></p>
          <input value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder={t('aichat.apiKeyNewPlaceholder')}
            className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center font-mono" />
          <div className="flex gap-2">
            <Button onClick={() => setShowKeyInput(false)} variant="glass" className="flex-1 text-sm py-2.5">{t('aichat.cancel')}</Button>
            <Button onClick={saveKey} variant="primary" className="flex-1 text-sm py-2.5">{t('aichat.save')}</Button>
            <Button onClick={() => { clearKey(); setShowKeyInput(false) }} variant="danger" className="flex-1 text-sm py-2.5">{t('aichat.delete')}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gradient">{t('aichat.title')}</h1>
        <button onClick={() => setShowKeyInput(true)} className="text-xs text-gray-500 underline">{t('aichat.keyLabel')}</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-green-500 text-black' : 'bg-dark-800 text-white'}`}>
              {m.text === '__greeting__' ? t('aichat.greeting') : m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
              <span className="animate-pulse">{t('aichat.thinking')}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 pt-2">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={t('aichat.placeholder')} className="flex-1 bg-dark-800 rounded-xl px-4 py-3 text-sm" />
          <button onClick={send} disabled={loading || !input.trim()}
            className="bg-green-500 text-black font-bold px-5 rounded-xl active:scale-95 transition-transform disabled:opacity-50">
            →
          </button>
        </div>
      </div>
    </div>
  )
}

function Button({ onClick, disabled, variant, className, children }) {
  const base = 'font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-40'
  const styles = {
    primary: 'bg-green-500 text-black',
    glass: 'bg-dark-700 text-white',
    danger: 'bg-red-500/20 text-red-400',
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} ${styles[variant] || styles.primary} ${className}`}>
      {children}
    </button>
  )
}
