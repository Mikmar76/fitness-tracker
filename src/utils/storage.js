const PREFIX = 'fittrack_'

export function load(key, def = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : def
  } catch { return def }
}

export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function loadDay(key) {
  return load(key + '_' + today(), key === 'water' ? 0 : [])
}

export function saveDay(key, value) {
  save(key + '_' + today(), value)
}

export function addFood(item) {
  const day = today()
  const log = load(`food_${day}`, [])
  log.push({ ...item, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) })
  save(`food_${day}`, log)
  return log
}

export function getFood() {
  return load(`food_${today()}`, [])
}

export function clearFood() {
  save(`food_${today()}`, [])
}

export function getFoodForDate(date) {
  return load(`food_${date}`, [])
}

export function loadUser() {
  return load('user', null)
}

export function saveUser(u) {
  save('user', u)
}

export function loadPrograms() {
  return load('programs', [
    { id: 1, name: 'Грудь + Бицепс', exercises: [{ id: 1, name: 'Жим лёжа', muscle: 'Грудь', image: '🏋️' }, { id: 5, name: 'Подъём штанги', muscle: 'Бицепс', image: '💪' }] },
    { id: 2, name: 'Спина + Трицепс', exercises: [{ id: 2, name: 'Тяга штанги', muscle: 'Спина', image: '🏋️' }, { id: 6, name: 'Французский жим', muscle: 'Трицепс', image: '💪' }] },
  ])
}

export function savePrograms(p) {
  save('programs', p)
}

export function loadWorkouts() {
  return load('workouts', [])
}

export function saveWorkouts(w) {
  save('workouts', w)
}

export function getWater() {
  return loadDay('water')
}

export function addWater(amount) {
  const current = getWater()
  const val = current + amount
  saveDay('water', val)
  return val
}

export function getSteps() {
  return loadDay('steps')
}

export function getStepsForDate(date) {
  return load(`steps_${date}`, 0)
}

export function saveSteps(val) {
  saveDay('steps', val)
}

export function getWeightLog() {
  return load('weight_log', [])
}

export function addWeightLog(weight) {
  const log = getWeightLog()
  log.push({ date: today(), weight: Number(weight) })
  save('weight_log', log)
  return log
}

export function getFavorites() {
  return load('favorites', [])
}

export function saveFavorites(favs) {
  save('favorites', favs)
}

export function toggleFavorite(id) {
  const favs = getFavorites()
  const idx = favs.indexOf(id)
  if (idx >= 0) favs.splice(idx, 1)
  else favs.push(id)
  saveFavorites(favs)
  return favs
}

export function getMeasurements() {
  return load('measurements', [])
}

export function saveMeasurement(m) {
  const list = getMeasurements()
  list.push({ date: today(), ...m })
  save('measurements', list)
  return list
}

export function clearAllData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
  keys.forEach(k => localStorage.removeItem(k))
}
