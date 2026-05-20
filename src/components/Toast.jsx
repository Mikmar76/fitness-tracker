import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  achievement: '🏆',
  workout: '💪',
  streak: '🔥',
  water: '💧',
  steps: '👟',
  info: '✨',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++idRef.current
    setToasts(prev => [...prev, { id, message, type, icon: ICONS[type] || '✨' }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-lg mx-auto">
        {toasts.map(t => (
          <div key={t.id}
            className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-up pointer-events-auto shadow-xl"
            style={{ animation: 'slideUp 0.4s ease-out' }}>
            <span className="text-xl">{t.icon}</span>
            <p className="text-sm font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast outside ToastProvider')
  return ctx
}
