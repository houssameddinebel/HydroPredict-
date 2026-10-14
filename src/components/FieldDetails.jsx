import React from 'react';
import { Droplets, CloudRain, Sun, Thermometer, Sprout, Leaf } from 'lucide-react';
import { t } from '../i18n/translations';

export default function FieldDetails({ lang, daily, prediction }) {
  const s = prediction.synthesis;
  const soilPct = daily.soilMoist?.[0] != null ? `${Math.round(daily.soilMoist[0] * 100)} %` : '—';
  const cards = [
    { icon: Droplets, label: t(lang, 'humidityMax'), value: daily.rhMax?.[0] != null ? `${daily.rhMax[0]} %` : '—' },
    { icon: CloudRain, label: t(lang, 'rainProb'), value: `${s.maxRainProb} %` },
    { icon: Sun, label: t(lang, 'sunshine'), value: `${s.totalSunH} h` },
    { icon: Thermometer, label: t(lang, 'soilTemp'), value: daily.soilTemp?.[0] != null ? `${daily.soilTemp[0]} °C` : '—' },
    { icon: Sprout, label: t(lang, 'soilMoist'), value: soilPct },
    { icon: Leaf, label: t(lang, 'gdd'), value: `${s.totalGDD}` }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-bold mb-3">{t(lang, 'soil') + ' · ' + t(lang, 'fieldDetails')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {cards.map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-3 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-[11px] mb-1">
              <Icon size={13} className="text-emerald-500" />
              {label}
            </div>
            <div className="font-extrabold tabular-nums">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
