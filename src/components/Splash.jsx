import { useEffect, useState } from 'react'
import { useT } from '../i18n/context'

export default function Splash({ onFinish }) {
  const t = useT()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 800)
    const t2 = setTimeout(onFinish, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-900 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30" />
        <div className="text-7xl mb-4 animate-bounce relative">💪</div>
      </div>
      <h1 className="text-2xl font-bold">FitTrack</h1>
      <p className="text-gray-400 text-sm mt-1">{t('splash.subtitle')}</p>
    </div>
  )
}
