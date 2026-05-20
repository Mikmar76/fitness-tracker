import React, { useState } from 'react'
import { useT } from '../i18n/context'

export default function Onboarding({ onDone }) {
  const t = useT()
  const [slide, setSlide] = useState(0)

  const slides = [
    { emoji: '💪', title: t('onboarding.slide1Title'), desc: t('onboarding.slide1Desc') },
    { emoji: '🥗', title: t('onboarding.slide2Title'), desc: t('onboarding.slide2Desc') },
    { emoji: '📈', title: t('onboarding.slide3Title'), desc: t('onboarding.slide3Desc') },
  ]

  const s = slides[slide]

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-sm">
        <div className="text-8xl mb-4">{s.emoji}</div>
        <h1 className="text-3xl font-bold">{s.title}</h1>
        <p className="text-gray-400 text-lg">{s.desc}</p>

        <div className="flex justify-center gap-2 pt-4">
          {slides.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slide ? 'bg-green-400' : 'bg-dark-600'}`} />
          ))}
        </div>

        <button
          onClick={() => slide < slides.length - 1 ? setSlide(s => s + 1) : onDone()}
          className="w-full bg-green-500 text-black font-bold py-4 rounded-2xl text-lg active:scale-95 transition-transform mt-4"
        >
          {slide < slides.length - 1 ? t('onboarding.next') : t('onboarding.start')}
        </button>
      </div>
    </div>
  )
}
