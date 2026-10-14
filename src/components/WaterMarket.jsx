import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { t } from '../i18n/translations';
import { DAMS, AQUIFERS, MARKET_PRICES, CLIMATE_NORMALS, MONTHS } from '../data/water';
import { chartColors } from './Charts';

const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800';

export function WaterResources({ lang }) {
  return (
    <div className="grid gap-4">
      <div className={card}>
        <h3 className="font-bold mb-3">{t(lang, 'damsTitle')} ({DAMS.length})</h3>
        <div className="grid gap-2">
          {DAMS.map((d) => (
            <div key={d.id} className="border border-slate-100 rounded-xl p-3 dark:border-slate-700">
              <div className="flex justify-between text-sm"><strong>{d.name[lang]}</strong><span className="tabular-nums">{d.fillPct}% · {Math.round(d.capacityMm3 * d.fillPct / 100)} Mm³</span></div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
                <div className={`h-full ${d.fillPct < 30 ? 'bg-red-500' : d.fillPct < 45 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${d.fillPct}%` }} />
              </div>
              <div className="text-[11px] text-gray-500 mt-1">{d.river} · {d.use[lang]} · cap {d.capacityMm3} Mm³</div>
            </div>
          ))}
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold mb-3">{t(lang, 'aquifersTitle')} ({AQUIFERS.length})</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {AQUIFERS.map((a) => (
            <div key={a.id} className={`border rounded-xl p-3 ${a.status === 'critical' ? 'border-red-200 bg-red-50/60 dark:bg-red-950/40 dark:border-red-900' : a.status === 'moderate' ? 'border-orange-200 bg-orange-50/60 dark:bg-orange-950/40 dark:border-orange-900' : 'border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-900'}`}>
              <strong className="text-sm">{a.name[lang]}</strong>
              <div className="text-xs tabular-nums mt-1">📏 {a.depthM} m · 📉 {a.trend} m/an</div>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">{a.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketPrices({ lang, dark }) {
  const c = chartColors(dark);
  return (
    <div className={card}>
      <h3 className="font-bold mb-3">{t(lang, 'marketsTitle')} ({MARKET_PRICES.length} produits)</h3>
      <Line data={{
        labels: MARKET_PRICES[0].months,
        datasets: MARKET_PRICES.map((m, i) => ({
          label: `${m.name[lang]} (${m.unit})`,
          data: m.prices,
          borderColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'][i % 6],
          tension: 0.35
        }))
      }} options={{ responsive: true, scales: { x: { ticks: { color: c.tick } }, y: { ticks: { color: c.tick } } }, plugins: { legend: { position: 'bottom', labels: { color: c.legend, boxWidth: 12, font: { size: 10 } } } } }} />
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs tabular-nums">
          <thead><tr className="text-gray-500 border-b dark:border-slate-700"><th className="text-start py-1">Produit</th>{MARKET_PRICES[0].months.map((m) => <th key={m} className="text-end px-1">{m}</th>)}</tr></thead>
          <tbody>{MARKET_PRICES.map((m) => (
            <tr key={m.id} className="border-b last:border-0 dark:border-slate-800"><td className="py-1 font-semibold">{m.name[lang]}</td>{m.prices.map((p, i) => <td key={i} className="text-end px-1">{p}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function ClimateNormals({ lang, dark, regionId }) {
  const key = CLIMATE_NORMALS[regionId] ? regionId : 'agadir';
  const n = CLIMATE_NORMALS[key];
  const c = chartColors(dark);
  return (
    <div className={card}>
      <h3 className="font-bold mb-1">{t(lang, 'climateTitle')} — {regionId}</h3>
      <p className="text-xs text-gray-500 mb-3">T° moy + pluie mensuelle (référence). {Object.keys(CLIMATE_NORMALS).length} zones détaillées.</p>
      <Bar data={{
        labels: MONTHS,
        datasets: [
          { type: 'line', label: 'T°C', data: n.t, borderColor: '#ef4444', backgroundColor: '#ef4444', yAxisID: 'y', tension: 0.35 },
          { type: 'bar', label: 'Pluie mm', data: n.rain, backgroundColor: '#38bdf8', borderRadius: 5, yAxisID: 'y1' }
        ]
      }} options={{ responsive: true, scales: {
        x: { ticks: { color: c.tick, font: { size: 9 } } },
        y: { ticks: { color: c.tick }, grid: { color: c.grid } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: c.tick } }
      }, plugins: { legend: { position: 'bottom', labels: { color: c.legend } } } }} />
    </div>
  );
}
