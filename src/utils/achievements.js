import { load, save } from './storage'

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'Первая тренировка', desc: 'Выполни первую тренировку', icon: '🎯' },
  { id: 'week_streak', name: 'Неделя без пропусков', desc: '7 дней подряд', icon: '🔥' },
  { id: 'month_streak', name: 'Марафон', desc: '30 дней подряд', icon: '💎' },
  { id: '100_workouts', name: 'Сотня', desc: '100 тренировок', icon: '🏆' },
  { id: '50_workouts', name: 'Полтинник', desc: '50 тренировок', icon: '🥇' },
  { id: '10_workouts', name: 'Дисциплина', desc: '10 тренировок', icon: '🥈' },
  { id: 'water_goal', name: 'Водный баланс', desc: 'Выпей норму воды 7 дней подряд', icon: '💧' },
  { id: 'steps_goal', name: 'Ходячий', desc: '10 000 шагов 7 дней подряд', icon: '👟' },
]

export function getAchievementsDef() {
  return ACHIEVEMENTS
}

export function getUnlocked() {
  return load('unlocked_achievements', [])
}

export function unlock(id) {
  const list = getUnlocked()
  if (list.includes(id)) return list
  list.push(id)
  save('unlocked_achievements', list)
  return list
}

export function getStreak() {
  return load('streak', { count: 0, lastDate: null })
}

export function updateStreak() {
  const s = getStreak()
  const t = new Date().toISOString().slice(0, 10)
  if (s.lastDate === t) return s
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (s.lastDate === yesterday) {
    s.count += 1
  } else {
    s.count = 1
  }
  s.lastDate = t
  save('streak', s)
  return s
}
