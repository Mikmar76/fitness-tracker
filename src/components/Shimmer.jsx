export default function Shimmer({ className = '', lines = 1 }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-dark-700 rounded animate-shimmer" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  )
}
