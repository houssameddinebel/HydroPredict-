import React from 'react';
import { Thermometer, Droplets, Wind, CloudRain, Sun } from 'lucide-react';
import { t } from '../i18n/translations';
import { RISK_COLORS } from '../services/predictionEngine';

export function StatusBadge({ lang, level }) {
  const c = RISK_COLORS[level] || RISK_COLORS.normal;
  const label =
    level === 'high' ? t(lang, 'statusHigh') : level === 'moderate' ? t(lang, 'statusModerate') : t(lang, 'statusNormal');
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${c.bg} ${c.text} ${c.pillDark}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}

export default function StatusCards({ lang, current, synthesis }) {
  const cards = [
    { icon: Thermometer, label: t(lang, 'currentWeather'), value: current ? `${current.temp}°C` : '—', sub: current?.time || '' },
    { icon: Droplets, label: t(lang, 'humidity'), value: current ? `${current.humidity}%` : '—' },
    { icon: Wind, label: t(lang, 'wind'), value: current ? `${current.wind} km/h` : '—' },
    { icon: CloudRain, label: t(lang, 'totalRain'), value: synthesis ? `${synthesis.totalRain} mm` : '—' },
    { icon: Sun, label: t(lang, 'avgET0'), value: synthesis ? `${synthesis.avgET0} mm/j` : '—' },
    { icon: Thermometer, label: t(lang, 'avgTemp'), value: synthesis ? `${synthesis.avgTemp}°C` : '—' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(({ icon: Icon, label, value, sub }, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs mb-1">
            <Icon size={15} className="text-emerald-500" />
            {label}
          </div>
          <div className="font-extrabold text-lg tabular-nums">{value}</div>
          {sub && <div className="text-[11px] text-gray-400 dark:text-slate-500 truncate">{sub}</div>}
        </div>
      ))}
    </div>
  );
}
