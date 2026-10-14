import React, { useState } from 'react';
import { t } from '../i18n/translations';
import { economyReport, exportCSV } from '../services/agronomyService';
import { dayLabel } from './Charts';

export default function CostsAnalysis({ lang, synthesis, daily, prediction, area, price }) {
  const [yieldQ, setYieldQ] = useState(60);
  const [sellP, setSellP] = useState(400);
  const eco = economyReport({ totalM3: synthesis.totalM3, savedM3: synthesis.savedM3, price, area, yieldQHa: yieldQ, sellPriceQ: sellP });
  const inp = 'border rounded-xl px-3 py-1.5 text-sm w-28 dark:bg-slate-800 dark:border-slate-700 tabular-nums';
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">{t(lang, 'costsTitle')}</h3>
        <button onClick={() => exportCSV('plan-irrigation.csv',
          [['jour', 'ETc', 'pluie', 'dose_mm', 'm3'], ...prediction.days.map((d, i) => [daily.time[i], d.etc, daily.precip[i], d.doseMm, (d.doseMm * 10 * area).toFixed(1)])])}
          className="text-xs font-bold border rounded-lg px-3 py-1.5 hover:border-emerald-500 dark:border-slate-700">⬇ {t(lang, 'exportCSV')}</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-center mb-3">
        {[
          [t(lang, 'waterCost'), `${eco.waterCost} MAD`, 'bg-sky-50 dark:bg-sky-950'],
          [t(lang, 'energyCost'), `${eco.energyCost} MAD`, 'bg-orange-50 dark:bg-orange-950'],
          [t(lang, 'revenue'), `${eco.revenue} MAD`, 'bg-emerald-50 dark:bg-emerald-950'],
          [t(lang, 'margin'), `${eco.margin} MAD`, 'bg-violet-50 dark:bg-violet-950']
        ].map(([l, v, bg], i) => (
          <div key={i} className={`rounded-xl border p-3 ${bg} dark:border-slate-700`}>
            <div className="text-[11px] text-gray-500 dark:text-slate-400">{l}</div>
            <div className="font-extrabold tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-sm items-center">
        <label>{t(lang, 'yieldQ')} <input type="number" value={yieldQ} onChange={(e) => setYieldQ(Number(e.target.value) || 0)} className={inp} /></label>
        <label>{t(lang, 'sellPrice')} <input type="number" value={sellP} onChange={(e) => setSellP(Number(e.target.value) || 0)} className={inp} /></label>
        <span className="text-xs text-gray-500">Économisé: {synthesis.savedM3} m³ ≈ {Math.round(synthesis.savedM3 * price)} MAD · {area} ha</span>
      </div>
      <div className="mt-3 text-xs text-gray-500 tabular-nums">
        {prediction.days.map((d, i) => <span key={i} className="inline-block me-2">{dayLabel(lang, daily.time[i], i)}: <strong>{d.doseMm}mm</strong></span>)}
      </div>
    </div>
  );
}
