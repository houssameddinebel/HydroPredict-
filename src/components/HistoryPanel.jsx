import React, { useCallback, useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RefreshCw, History } from 'lucide-react';
import { t } from '../i18n/translations';
import { fetchLogs } from '../services/backendApi';
import { getRegionById } from '../data/regions';
import { RISK_COLORS } from '../services/predictionEngine';
import { chartColors } from './Charts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const parsePayload = (p) => {
  try {
    return typeof p === 'string' ? JSON.parse(p) : p || {};
  } catch {
    return {};
  }
};

const riskLabel = (lang, risk) =>
  risk === 'high' ? t(lang, 'statusHigh') : risk === 'moderate' ? t(lang, 'statusModerate') : t(lang, 'statusNormal');

const cardCls = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800';

export default function HistoryPanel({ lang, dark }) {
  const [logs, setLogs] = useState({ forecasts: [], selections: [] });
  const [loading, setLoading] = useState(true);
  const c = chartColors(dark);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchLogs(30);
    if (res.ok) setLogs({ forecasts: res.forecasts || [], selections: res.selections || [] });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const rows = logs.forecasts.map((f) => ({ ...f, syn: parsePayload(f.payload)?.synthesis || {} }));
  const doses = rows.map((r) => Number(r.syn.totalDoseMm) || 0);
  const avgDose = doses.length ? (doses.reduce((a, b) => a + b, 0) / doses.length).toFixed(1) : '—';
  const totalM3 = rows.reduce((a, r) => a + (Number(r.syn.totalM3) || 0), 0).toFixed(0);
  const riskCount = { normal: 0, moderate: 0, high: 0 };
  rows.forEach((r) => { if (riskCount[r.risk] !== undefined) riskCount[r.risk]++; });

  return (
    <section id="history" className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <History size={18} className="text-emerald-500" />
          {t(lang, 'history')}
        </h2>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-emerald-400 transition dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-600"
        >
          <RefreshCw size={14} />
          {t(lang, 'histRefresh')}
        </button>
      </div>

      {loading && <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-gray-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">{t(lang, 'loading')}</div>}

      {!loading && rows.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-gray-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 text-center">
          {t(lang, 'histEmpty')}
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={cardCls}>
              <div className="text-xs text-gray-500 dark:text-slate-400">{t(lang, 'histPlans')}</div>
              <div className="font-extrabold text-xl tabular-nums">{rows.length}</div>
            </div>
            <div className={cardCls}>
              <div className="text-xs text-gray-500 dark:text-slate-400">{t(lang, 'histAvgDose')}</div>
              <div className="font-extrabold text-xl tabular-nums">{avgDose} mm</div>
            </div>
            <div className={cardCls}>
              <div className="text-xs text-gray-500 dark:text-slate-400">{t(lang, 'histTotalWater')}</div>
              <div className="font-extrabold text-xl tabular-nums">{totalM3} m³</div>
            </div>
            <div className={cardCls}>
              <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">{t(lang, 'histRisk')}</div>
              <div className="flex gap-1.5">
                {Object.entries(riskCount).map(([k, v]) => (
                  <span key={k} className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[k].bg} ${RISK_COLORS[k].text} ${RISK_COLORS[k].pillDark}`}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold mb-3">{t(lang, 'histAvgDose')} / {t(lang, 'histForecasts')}</h3>
            <Bar
              data={{
                labels: rows.map((r) => `${getRegionById(r.region_id).name[lang]} ${r.forecast_date}`).reverse(),
                datasets: [{
                  data: rows.map((r) => Number(r.syn.totalDoseMm) || 0).reverse(),
                  backgroundColor: rows.map((r) => RISK_COLORS[r.risk]?.hex || '#16a34a').reverse(),
                  borderRadius: 6
                }]
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                scales: {
                  x: { ticks: { color: c.tick }, grid: { color: c.grid }, title: { display: true, text: 'mm', color: c.tick } },
                  y: { ticks: { color: c.tick }, grid: { color: c.grid } }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-x-auto dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold mb-3">{t(lang, 'histForecasts')}</h3>
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="text-xs text-gray-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-start py-2 pe-2">{t(lang, 'colDate')}</th>
                  <th className="text-start py-2 px-2">{t(lang, 'colRegion')}</th>
                  <th className="text-end py-2 px-2">{t(lang, 'colRisk')}</th>
                  <th className="text-end py-2 px-2">{t(lang, 'colDose')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-2 pe-2 whitespace-nowrap">{r.forecast_date}</td>
                    <td className="py-2 px-2">{getRegionById(r.region_id).name[lang]}</td>
                    <td className="text-end py-2 px-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[r.risk]?.bg} ${RISK_COLORS[r.risk]?.text} ${RISK_COLORS[r.risk]?.pillDark}`}>
                        {riskLabel(lang, r.risk)}
                      </span>
                    </td>
                    <td className="text-end py-2 px-2 font-bold">{Number(r.syn.totalDoseMm) || 0} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-x-auto dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold mb-3">{t(lang, 'histSelections')}</h3>
            <table className="w-full text-sm">
              <tbody>
                {(logs.selections || []).slice(0, 10).map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-2 pe-2 whitespace-nowrap text-gray-500 dark:text-slate-400">{(s.created_at || '').slice(0, 16).replace('T', ' ')}</td>
                    <td className="py-2 px-2">{getRegionById(s.region_id).name[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
