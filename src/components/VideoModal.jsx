import React from 'react'
import { useT } from '../i18n/context'

export default function VideoModal({ exercise, onClose }) {
  const t = useT()
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-dark-800 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-dark-600 flex justify-between items-center">
          <span className="font-semibold text-sm">{exercise.name}</span>
          <button onClick={onClose} className="text-gray-400 text-lg leading-none">&times;</button>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0`}
            title={exercise.name}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        <div className="p-3 text-center border-t border-dark-600">
          <a href={`https://www.youtube.com/watch?v=${exercise.videoId}`} target="_blank" rel="noopener noreferrer"
            className="text-green-400 text-sm hover:underline">
            YouTube ↗
          </a>
        </div>
      </div>
    </div>
  )
}
