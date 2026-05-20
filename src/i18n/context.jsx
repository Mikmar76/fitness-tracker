import React, { createContext, useContext, useState, useCallback } from 'react'
import ru from './ru'
import en from './en'
import { load, save } from '../utils/storage'

const LANG_KEY = 'fittrack_lang'
const langs = { ru, en }

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => load(LANG_KEY, 'ru'))
  const setLang = useCallback(l => {
    setLangState(l)
    save(LANG_KEY, l)
  }, [])

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.')
    let val = langs[lang]
    for (const k of keys) {
      val = val?.[k]
    }
    if (val === undefined) return key
    if (typeof val === 'string') {
      return val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
    }
    return val
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}

export function useT() {
  return useLanguage().t
}
