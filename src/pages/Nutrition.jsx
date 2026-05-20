import React, { useState, useEffect, lazy, Suspense } from 'react'
import { addFood, getFood, clearFood } from '../utils/storage'
import Button from '../components/Button'
import { useT } from '../i18n/context'

const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'))

const FALLBACK_PRODUCTS = (t) => ({
  '5901234123457': { name: t('nutrition.proteinBar'), kcal: 220, protein: 20, fat: 8, carbs: 18 },
  '4607009520014': { name: t('nutrition.cottageCheese'), kcal: 145, protein: 16, fat: 5, carbs: 3 },
  '2000000000001': { name: t('nutrition.chickenBreast'), kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
  '2000000000002': { name: t('nutrition.oatmeal'), kcal: 350, protein: 13, fat: 6, carbs: 60 },
})

export default function Nutrition() {
  const t = useT()
  const [barcodeInput, setBarcodeInput] = useState('')
  const [log, setLog] = useState(getFood)
  const [manual, setManual] = useState({ name: '', kcal: '', protein: '' })
  const [showScanner, setShowScanner] = useState(false)
  const [scannedProduct, setScannedProduct] = useState(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => { setLog(getFood()) }, [])

  const lookupBarcode = async (code) => {
    setSearching(true)
    setScannedProduct(null)

    const fallback = FALLBACK_PRODUCTS(t)[code]
    if (fallback) {
      const updated = addFood(fallback)
      setLog(updated)
      setScannedProduct(fallback)
      setSearching(false)
      return
    }

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`)
      const data = await res.json()
      if (data.status === 1) {
        const p = data.product
        const hasKcal = p.nutriments?.['energy-kcal_100g'] != null
        const item = {
          name: p.product_name || `Продукт ${code}`,
          kcal: hasKcal ? Math.round(p.nutriments['energy-kcal_100g']) : 0,
          protein: p.nutriments?.proteins_100g != null ? Math.round(p.nutriments.proteins_100g) : 0,
          fat: p.nutriments?.fat_100g != null ? Math.round(p.nutriments.fat_100g) : 0,
          carbs: p.nutriments?.carbohydrates_100g != null ? Math.round(p.nutriments.carbohydrates_100g) : 0,
          image: p.image_url || p.image_small_url || null,
          barcode: code,
          noNutrition: !hasKcal,
        }
        const updated = addFood(item)
        setLog(updated)
        setScannedProduct(item)
      } else {
        setScannedProduct({ name: `Код: ${code}`, kcal: '?', protein: '?', notFound: true })
      }
    } catch {
      setScannedProduct({ name: `Код: ${code}`, kcal: '?', protein: '?', notFound: true })
    }
    setSearching(false)
  }

  const handleBarcode = (code) => {
    lookupBarcode(code)
  }

  const parseNum = (v) => parseFloat(v.replace(',', '.')) || 0

  const addManual = () => {
    if (!manual.name) return
    const item = { name: manual.name, kcal: parseNum(manual.kcal), protein: parseNum(manual.protein) }
    const updated = addFood(item)
    setLog(updated)
    setManual({ name: '', kcal: '', protein: '' })
  }

  const totalKcal = log.reduce((s, i) => s + (Number(i.kcal) || 0), 0)
  const totalProtein = log.reduce((s, i) => s + (Number(i.protein) || 0), 0)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gradient">{t('nutrition.title')}</h1>

      <div className="card-gradient-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{t('nutrition.calories')}</span>
          <span className="font-bold">{totalKcal} / 2,000 {t('statistics.kcal')}</span>
        </div>
        <div className="h-2.5 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all" style={{ width: `${Math.min(100, totalKcal / 20)}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{t('nutrition.protein')}</span>
          <span className="font-bold">{totalProtein} / 120 г</span>
        </div>
        <div className="h-2.5 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: `${Math.min(100, totalProtein / 1.2)}%` }} />
        </div>
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">{t('nutrition.barcodeScanner')}</h2>
        <div className="flex gap-2">
          <input value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} placeholder={t('nutrition.orEnterCode')}
            className="flex-1 min-w-0 bg-dark-700 rounded-xl px-4 py-3 text-sm" />
          <button onClick={() => { if (barcodeInput) lookupBarcode(barcodeInput); setBarcodeInput('') }}
            className="bg-dark-700 px-4 rounded-xl text-sm shrink-0">{t('common.ok')}</button>
          <Button onClick={() => setShowScanner(true)} variant="neon" className="shrink-0" style={{fontSize:'1.25rem',padding:'0.5rem 0.75rem'}}>
            📷
          </Button>
        </div>
        <p className="text-[10px] text-gray-500 -mt-1">{t('nutrition.scanHint')}</p>
        {searching && (
          <div className="flex items-center gap-3 text-sm text-gray-400 py-2">
            <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            {t('nutrition.searchProduct')}
          </div>
        )}
        {scannedProduct && !searching && (
          <div className="bg-dark-700 rounded-xl p-3 text-sm space-y-2">
            <div className="flex items-center gap-3">
              {scannedProduct.image && (
                <img src={scannedProduct.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{scannedProduct.name}</p>
                {scannedProduct.kcal !== '?' && scannedProduct.noNutrition ? (
                  <p className="text-gray-500 text-xs">{t('nutrition.noData')}</p>
                ) : scannedProduct.kcal !== '?' ? (
                  <p className="text-gray-400 text-xs">
                    {scannedProduct.kcal} ккал · Б {scannedProduct.protein}г · Ж {scannedProduct.fat}г · У {scannedProduct.carbs}г
                  </p>
                ) : null}
              </div>
            </div>
            {scannedProduct.notFound && (
              <p className="text-gray-500 text-xs">{t('nutrition.notFound')}</p>
            )}
            {scannedProduct.barcode && (
              <p className="text-gray-600 text-[10px] break-all">{t('scanner.enterCode')}: {scannedProduct.barcode}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-dark-800 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">{t('nutrition.addManual')}</h2>
        <input placeholder={t('nutrition.productName')} value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })}
          className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('nutrition.kcalPer100g')}</label>
            <input placeholder="0" inputMode="decimal" value={manual.kcal} onChange={e => setManual({ ...manual, kcal: e.target.value })}
              className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('nutrition.proteinPer100g')}</label>
            <input placeholder="0" inputMode="decimal" value={manual.protein} onChange={e => setManual({ ...manual, protein: e.target.value })}
              className="w-full bg-dark-700 rounded-xl px-4 py-3 text-sm text-center" />
          </div>
        </div>
        <Button onClick={addManual} variant="glass" className="w-full text-sm py-3">{t('nutrition.add')}</Button>
      </div>

      {log.length > 0 && (
        <div className="bg-dark-800 rounded-2xl p-4 space-y-2">
          <h2 className="font-semibold">{t('nutrition.diary')}</h2>
          {log.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-dark-600 last:border-0">
              {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />}
              <span className="truncate min-w-0 flex-1">{item.name}</span>
              <span className="text-gray-400 shrink-0">{item.time} · {item.kcal} {t('statistics.kcal')}</span>
            </div>
          ))}
        </div>
      )}

      {log.length > 0 && (
        <button onClick={() => { clearFood(); setLog([]) }}
          className="w-full bg-red-500/10 text-red-400 py-3 rounded-xl text-sm active:scale-95 transition-transform">
          🗑️ {t('nutrition.clearDiary')}
        </button>
      )}

      {showScanner && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <BarcodeScanner onScan={handleBarcode} onClose={() => setShowScanner(false)} />
        </Suspense>
      )}
    </div>
  )
}
