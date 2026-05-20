import { useState, useEffect } from 'react'
import Button from './Button'
import { useT } from '../i18n/context'

export default function InstallPWA() {
  const t = useT()
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  return (
    <div className="glass-strong fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto rounded-2xl p-4 flex items-center gap-3 animate-slide-up">
      <span className="text-3xl">💪</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{t('install.title')}</p>
        <p className="text-xs text-gray-400">{t('install.desc')}</p>
      </div>
      <Button onClick={() => { deferred.prompt(); setShow(false) }} variant="primary" className="px-4 py-2 text-sm">{t('install.install')}</Button>
      <button onClick={() => setShow(false)} className="text-gray-500 text-lg hover:text-white transition-colors">✕</button>
    </div>
  )
}
