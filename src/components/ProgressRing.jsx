import React from 'react'

export default function ProgressRing({ progress, size = 100, stroke = 6, color = '#22c55e', label, value, unit }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2e2e3d" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <span className="absolute text-center" style={{ lineHeight: `${size}px`, marginTop: -size }}>
        <span className="text-lg font-bold">{value}</span>
        {unit && <span className="text-xs text-gray-400 ml-0.5">{unit}</span>}
      </span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}
