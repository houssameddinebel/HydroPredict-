import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { t } from '../i18n/translations';
import { REGIONS, getRegionById } from '../data/regions';
import { fetchHydroWeather } from '../services/weatherApi';
import { predictWeek } from '../services/predictionEngine';
import { chartColors } from './Charts';

const PRESET = ['agadir', 'taroudant', 'fes'];
const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800';

export default function RegionCompare({ lang, dark, cropKc = 1 }) {
  const [ids, setIds] = useState(PRESET);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const c = chartColors(dark);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const out = {};
      await Promise.all(ids.map(async (id) => {
        try {
          const r = getRegionById(id);
          const w = await fetchHydroWeather(r.lat, r.lon);
          out[id] = { weather: w, pred: predictWeek(w.daily, cropKc, 1) };
        } catch { out[id] = null; }
      }));
      if (alive) { setData(out); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [ids.join(','), cropKc]);

  const toggle = (id) => setIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-4));

  const labels = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'];
  const colors = { agadir: '#10b981', taroudant: '#f59e0b', fes: '#3b82f6' };
  const colorFor = (id, i) => colors[id] || ['#8b5cf6', '#ec4899', '#14b8a6', '#f97316'][i % 4];

  return (
    <section className={card}>
      <h2 className="font-bold text-lg">{t(lang, 'compareTitle')}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{t(lang, 'compareHint')}</p>
      <div className="flex flex-wrap gap-1.5 mb-4 max-h-32 overflow-y-auto">
        {REGIONS.map((r) => (
          <button key={r.id} onClick={() => toggle(r.id)}
            className={`text-xs px-2.5 py-1 rounded-full border ${ids.includes(r.id) ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            {r.name[lang]}
          </button>
        ))}
      </div>
      {ids.length < 2 && <p className="text-sm text-orange-500">{t(lang, 'select2cities')}</p>}
      {loading && <p className="text-sm text-gray-500">{t(lang, 'loading')}</p>}
      {!loading && ids.length >= 2 && (
        <>
          <Line data={{ labels, datasets: ids.map((id, i) => ({
            label: getRegionById(id).name[lang],
            data: data[id]?.weather.daily.tmax || [],
            borderColor: colorFor(id, i), backgroundColor: colorFor(id, i), tension: 0.35
          })) }}
            options={{ responsive: true, scales: { x: { ticks: { color: c.tick } }, y: { ticks: { color: c.tick } } }, plugins: { legend: { position: 'bottom', labels: { color: c.legend } } } }} />
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="text-xs text-gray-500 border-b dark:border-slate-700">
                <th className="text-start py-2">Ville</th><th className="text-end">Tmax</th>
                <th className="text-end">Pluie 7j</th><th className="text-end">ET₀ moy</th>
                <th className="text-end">Dose mm</th><th className="text-end">m³/ha</th><th className="text-end">Risque</th>
              </tr></thead>
              <tbody>
                {ids.map((id) => {
                  const d = data[id]; if (!d) return null;
                  const s = d.pred.synthesis;
                  return (
                    <tr key={id} className="border-b last:border-0 dark:border-slate-800">
                      <td className="py-2 font-bold">{getRegionById(id).name[lang]}</td>
                      <td className="text-end">{Math.max(...d.weather.daily.tmax)}°C</td>
                      <td className="text-end text-sky-600">{s.totalRain} mm</td>
                      <td className="text-end">{s.avgET0}</td>
                      <td className="text-end font-bold text-emerald-600">{s.totalDoseMm}</td>
                      <td className="text-end">{s.totalM3}</td>
                      <td className="text-end">{s.globalRisk}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
