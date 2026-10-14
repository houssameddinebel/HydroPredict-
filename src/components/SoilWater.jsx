import React from 'react';
import { Bar } from 'react-chartjs-2';
import { t } from '../i18n/translations';
import { soilWaterBalance } from '../services/agronomyService';
import { getSoilById, getCropById } from '../data/crops';
import { chartColors } from './Charts';

export default function SoilWater({ lang, dark, daily, prediction, soilId, cropId }) {
  const soil = getSoilById(soilId);
  const crop = getCropById(cropId);
  const bal = soilWaterBalance(daily, soil.ruMmM, crop.rootCm, prediction.days.map((d) => d.etc));
  const c = chartColors(dark);
  const stressDays = bal.filter((b) => b.stress).length;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-bold">{t(lang, 'soilBalanceTitle')}</h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
        {soil.name[lang]} · RU {soil.ruMmM} mm/m · racines {crop.rootCm} cm · réserve {bal[0]?.RU} mm
        {stressDays > 0 ? ` · ⚠️ ${stressDays}j ${t(lang, 'stressSoil')}` : ` · ✅ ${t(lang, 'stockPct')} OK`}
      </p>
      <Bar data={{
        labels: bal.map((b) => b.date.slice(5)),
        datasets: [{ data: bal.map((b) => b.pct), backgroundColor: bal.map((b) => (b.stress ? '#ef4444' : '#10b981')), borderRadius: 6 }]
      }} options={{
        responsive: true,
        scales: {
          x: { ticks: { color: c.tick }, grid: { color: c.grid } },
          y: { min: 0, max: 100, ticks: { color: c.tick }, grid: { color: c.grid }, title: { display: true, text: '%', color: c.tick } }
        },
        plugins: { legend: { display: false } }
      }} />
      <div className="grid grid-cols-7 gap-1 mt-3 text-center text-[11px] tabular-nums">
        {bal.map((b, i) => (
          <div key={i} className={`rounded-lg p-1.5 border ${b.stress ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
            <div className="font-bold">{b.pct}%</div>
            <div className="text-gray-500">{b.stock}mm</div>
          </div>
        ))}
      </div>
    </div>
  );
}
