import React from 'react'
import { NavLink } from 'react-router-dom'
import { useT } from '../i18n/context'

const links = [
  { to: '/', icon: '📊', key: 'nav.dashboard' },
  { to: '/workout', icon: '💪', key: 'nav.workout' },
  { to: '/nutrition', icon: '🥗', key: 'nav.nutrition' },
  { to: '/calendar', icon: '📅', key: 'nav.calendar' },
  { to: '/chat', icon: '🤖', label: 'AI' },
]

export default function BottomNav() {
  const t = useT()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-dark-800/90 backdrop-blur-lg border-t border-dark-600 px-2 pb-2 pt-1 max-w-lg mx-auto">
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${isActive ? 'bg-green-500/10 text-green-400 scale-105' : 'text-gray-500 hover:text-gray-300'}`
          }>
          <span className="text-xl">{l.icon}</span>
          <span className="text-[10px] font-medium">{l.label || t(l.key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
