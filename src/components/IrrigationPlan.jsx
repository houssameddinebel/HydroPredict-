import React from 'react';
import { CalendarCheck, PiggyBank } from 'lucide-react';
import { t } from '../i18n/translations';
import { dayLabel } from './Charts';
import { getSoilById } from '../data/crops';

export default function IrrigationPlan({ lang, daily, prediction, area, soilId, price }) {
  const s = prediction.synthesis;
  const soil = getSoilById(soilId);
  const labels = daily.time.map((d, i) => dayLabel(lang, d, i));

  return (
    <section id="plan" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-1">
        <CalendarCheck size={18} className="text-emerald-500" />
        <h2 className="font-bold text-lg">{t(lang, 'irrigationPlan')}</h2>
        <button
          onClick={() => window.print()}
          className="no-print ms-auto flex items-center gap-1.5 text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 hover:border-emerald-500 transition dark:border-slate-700"
        >
          🖨 {t(lang, 'printReport')}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{soil.tip[lang]}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs text-gray-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="text-start py-2 pe-2">{t(lang, 'day')}</th>
              <th className="text-end py-2 px-2">ETc mm</th>
              <th className="text-end py-2 px-2">{t(lang, 'precipitation')} mm</th>
              <th className="text-end py-2 px-2">{t(lang, 'doseMm')} mm</th>
              <th className="text-end py-2 px-2">{t(lang, 'volumeM3')} m³</th>
              <th className="text-end py-2 ps-2">{t(lang, 'window')}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {prediction.days.map((d, i) => {
              const vol = d.doseMm * 10 * area;
              return (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="py-2 pe-2 font-semibold whitespace-nowrap">{labels[i]}</td>
                  <td className="text-end py-2 px-2">{d.etc}</td>
                  <td className="text-end py-2 px-2 text-sky-600 dark:text-sky-400">{daily.precip[i]}</td>
                  <td className={`text-end py-2 px-2 font-bold ${d.doseMm > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500'}`}>
                    {d.doseMm}
                  </td>
                  <td className="text-end py-2 px-2">
                    {vol > 0 ? (soil.splits === 2 ? `2 × ${(vol / 2).toFixed(1)}` : vol.toFixed(1)) : '—'}
                  </td>
                  <td className="text-end py-2 ps-2 text-xs font-semibold whitespace-nowrap">
                    {d.window === 'late' ? `⚠️ ${t(lang, 'windowLate')}` : `🌅 ${t(lang, 'windowDawn')}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mt-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm dark:bg-emerald-950/60 dark:border-emerald-900">
          <span className="text-gray-600 dark:text-slate-300">{t(lang, 'weekTotal')}: </span>
          <strong className="tabular-nums">{s.totalDoseMm} mm · {s.totalM3} m³ ≈ {Math.round(s.totalM3 * (price || 0))} {t(lang, 'currency')}</strong>
          <span className="text-gray-500 dark:text-slate-400"> ({area} ha)</span>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm flex items-center gap-2 dark:bg-sky-950/60 dark:border-sky-900">
          <PiggyBank size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            {t(lang, 'savings')}: <strong className="tabular-nums">{s.savedMm} mm · {s.savedM3} m³ ≈ {Math.round(s.savedM3 * (price || 0))} {t(lang, 'currency')}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
