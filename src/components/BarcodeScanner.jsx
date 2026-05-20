import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import { useT } from '../i18n/context'

export default function BarcodeScanner({ onScan, onClose }) {
  const t = useT()
  const videoRef = useRef(null)
  const readerRef = useRef(null)
  const mountedRef = useRef(true)
  const [error, setError] = useState('')
  const [torch, setTorch] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)
  const [found, setFound] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [useManual, setUseManual] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    startScanning()
    return () => {
      mountedRef.current = false
      stopAll()
    }
  }, [])

  const startScanning = async () => {
    try {
      const md = navigator.mediaDevices
      if (!md?.enumerateDevices) {
        setError(t('scanner.noSupport'))
        return
      }
      const devices = await md.enumerateDevices()
      const cams = devices.filter(d => d.kind === 'videoinput')
      if (cams.length === 0) { setError(t('scanner.notFound')); return }

      const backCam = cams.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear') || c.label.toLowerCase().includes('environment')) || cams[0]

      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader

      reader.decodeFromVideoDevice(backCam.deviceId, videoRef.current, (result, err) => {
        if (!mountedRef.current) return
        if (!err && result && !found) {
          const code = result.getText()
          setFound(code)
          navigator.vibrate?.(50)
          stopAll()
          setTimeout(() => { onScan(code); onClose() }, 400)
        }
        if (err && err.message?.includes('NotAllowedError')) {
          setError(t('scanner.denied'))
        }
      })

      setTimeout(() => {
        if (!mountedRef.current) return
        const video = videoRef.current
        if (video?.srcObject) {
          const track = video.srcObject.getVideoTracks()[0]
          if (track?.getCapabilities?.()?.torch) setTorchSupported(true)
        }
      }, 1000)
    } catch {
      if (mountedRef.current) setError(t('scanner.cannotOpen'))
    }
  }

  const stopAll = () => {
    if (readerRef.current) { readerRef.current.reset(); readerRef.current = null }
    const video = videoRef.current
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop())
      video.srcObject = null
    }
  }

  const toggleTorch = async () => {
    try {
      const video = videoRef.current
      if (!video?.srcObject) return
      const track = video.srcObject.getVideoTracks()[0]
      await track.applyConstraints({ advanced: [{ torch: !torch }] })
      setTorch(!torch)
    } catch {}
  }

  const confirmManual = () => {
    if (manualCode.trim()) onScan(manualCode.trim())
  }

  if (useManual) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
        <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
          <h3 className="font-bold text-lg text-center">{t('scanner.enterCode')}</h3>
          <input value={manualCode} onChange={e => setManualCode(e.target.value)}
            placeholder={t('scanner.digits13')} maxLength={13} inputMode="numeric"
            className="w-full bg-dark-700 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest" />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-dark-700 py-3 rounded-xl text-sm">{t('scanner.cancel')}</button>
            <button onClick={confirmManual} className="flex-1 bg-green-500 text-black font-bold py-3 rounded-xl text-sm">{t('scanner.done')}</button>
          </div>
        </div>
      </div>
    )
  }

  if (found) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
        <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-sm text-center space-y-2 animate-slide-up">
          <span className="text-4xl">✅</span>
          <p className="text-green-400 font-mono text-lg">{found}</p>
          <p className="text-gray-400 text-sm">{t('scanner.searching')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full max-w-sm aspect-[3/2] mx-auto rounded-2xl overflow-hidden bg-dark-900">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

        {!error && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-[15%] border-2 border-green-400/60 rounded-2xl">
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
              <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
              <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
              <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-green-400/40 animate-pulse" style={{boxShadow:'0 0 8px rgba(34,197,94,0.4)'}} />
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-400 text-sm text-center px-4">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6 w-full max-w-sm px-6">
        <button onClick={onClose} className="flex-1 bg-dark-700 py-3.5 rounded-2xl text-sm font-medium">{t('scanner.cancel')}</button>
        {torchSupported && !error && (
          <button onClick={toggleTorch}
            className={`px-5 py-3.5 rounded-2xl text-lg transition-colors ${torch ? 'bg-yellow-500 text-black' : 'bg-dark-700'}`}>
            🔦
          </button>
        )}
        <button onClick={() => { stopAll(); setUseManual(true) }}
          className="bg-dark-700 py-3.5 px-4 rounded-2xl text-sm">⌨️</button>
      </div>

      {error && (
        <button onClick={() => { stopAll(); setUseManual(true) }}
          className="text-gray-400 text-sm mt-3 underline">{t('scanner.enterCode')}</button>
      )}

      {!error && !found && <p className="text-gray-500 text-xs mt-4">{t('scanner.hint')}</p>}
    </div>
  )
}
