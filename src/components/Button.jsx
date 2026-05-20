import { useRef } from 'react'

const VARIANTS = {
  primary: 'btn btn-gradient text-white',
  neon: 'btn btn-neon text-white',
  glass: 'btn btn-glass text-white',
  outline: 'btn btn-outline text-white',
  danger: 'btn btn-danger text-white',
  purple: 'btn btn-purple text-white',
  orange: 'btn btn-orange text-white',
  ghost: 'btn bg-dark-700 text-white hover:bg-dark-600',
}

export default function Button({ variant = 'primary', className = '', children, onClick, disabled, ...props }) {
  const ref = useRef(null)

  const handleClick = (e) => {
    if (disabled) return
    const btn = ref.current
    if (!btn) { onClick?.(e); return }
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      className={`${VARIANTS[variant] || VARIANTS.primary} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
