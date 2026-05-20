import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ROUTE_ORDER = ['/', '/workout', '/nutrition', '/calendar', '/chat']

export default function useSwipe() {
  const nav = useNavigate()
  const startX = useRef(0)

  useEffect(() => {
    const onTouchStart = (e) => { startX.current = e.changedTouches[0].screenX }
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].screenX - startX.current
      const idx = ROUTE_ORDER.indexOf(window.location.pathname)
      if (Math.abs(dx) < 60) return
      if (dx > 0 && idx > 0) nav(ROUTE_ORDER[idx - 1])
      else if (dx < 0 && idx < ROUTE_ORDER.length - 1) nav(ROUTE_ORDER[idx + 1])
    }
    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [nav])
}
