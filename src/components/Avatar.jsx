const GRADIENTS = [
  ['#22c55e', '#16a34a'],
  ['#3b82f6', '#2563eb'],
  ['#a855f7', '#7c3aed'],
  ['#f97316', '#ea580c'],
  ['#ec4899', '#db2777'],
  ['#14b8a6', '#0d9488'],
]

export default function Avatar({ name = '?', size = 'text-5xl', className = '' }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const gradient = GRADIENTS[hash % GRADIENTS.length]

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold text-white select-none ${size} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        width: '1.5em',
        height: '1.5em',
        fontSize: size.match(/\d+/)?.[0] ? undefined : undefined,
      }}
    >
      {initials}
    </div>
  )
}
