import React from 'react';
import { Droplets, PiggyBank, CloudRain, Flame } from 'lucide-react';
import { t } from '../i18n/translations';
import { dayLabel } from './Charts';

// Four big farmer-readable week statistics.
export default function StatCards({ lang, daily, synthesis, area, price }) {
  const maxT = Math.max(...daily.tmax);
  const hotIdx = daily.tmax.indexOf(maxT);
  const savedMAD = Math.round(synthesis.savedM3 * (price || 0));

  const cards = [
    {
      icon: Droplets, color: 'text-sky-500',
      bg: 'bg-sky-50 border-sky-200 dark:bg-sky-950/60 dark:border-sky-900',
      label: t(lang, 'statWater'),
      value: `${synthesis.totalM3} m³`,
      sub: `${synthesis.totalDoseMm} mm · ${area} ha`
    },
    {
      icon: PiggyBank, color: 'text-emerald-500',
      bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900',
      label: t(lang, 'statSaved'),
      value: `${synthesis.savedM3} m³`,
      sub: `≈ ${savedMAD} ${t(lang, 'currency')}`
    },
    {
      icon: CloudRain, color: 'text-blue-500',
      bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:border-blue-900',
      label: t(lang, 'statRain'),
      value: `${synthesis.rainyDays} / 7`,
      sub: `${synthesis.totalRain} mm`
    },
    {
      icon: Flame, color: 'text-red-500',
      bg: 'bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-900',
      label: t(lang, 'statHot'),
      value: `${maxT} °C`,
      sub: dayLabel(lang, daily.time[hotIdx], hotIdx)
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ icon: Icon, color, bg, label, value, sub }, i) => (
        <div key={i} className={`rounded-2xl border shadow-sm p-4 ${bg}`}>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 mb-1">
            <Icon size={16} className={color} />
            {label}
          </div>
          <div className="font-extrabold text-xl tabular-nums">{value}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{sub}</div>
        </div>
      ))}
    </div>
  );
}
