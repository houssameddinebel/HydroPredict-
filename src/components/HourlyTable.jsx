import React from 'react';
import { t } from '../i18n/translations';
import { dayLabel } from './Charts';

// 48h table from Open-Meteo raw hourly (first 48 entries).
export default function HourlyTable({ lang, raw }) {
  if (!raw?.hourly?.time) return null;
  const n = Math.min(48, raw.hourly.time.length);
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      time: raw.hourly.time[i],
      temp: raw.hourly.temperature_2m?.[i],
      rh: raw.hourly.relative_humidity_2m?.[i],
      soilT: raw.hourly.soil_temperature_6cm?.[i],
      soilM: raw.hourly.soil_moisture_3_9cm?.[i]
    });
  }
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-bold mb-3">{t(lang, 'hourlyTitle')}</h3>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-xs tabular-nums">
          <thead className="sticky top-0 bg-white dark:bg-slate-900">
            <tr className="text-gray-500 border-b dark:border-slate-700">
              <th className="text-start py-2 pe-2">Heure</th>
              <th className="text-end px-2">T°C</th>
              <th className="text-end px-2">HR%</th>
              <th className="text-end px-2">Sol °C</th>
              <th className="text-end ps-2">Sol m³/m³</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b last:border-0 dark:border-slate-800">
                <td className="py-1.5 pe-2 whitespace-nowrap">{r.time.slice(5).replace('T', ' ')}</td>
                <td className="text-end px-2 font-bold">{r.temp ?? '—'}</td>
                <td className="text-end px-2">{r.rh ?? '—'}</td>
                <td className="text-end px-2">{r.soilT ?? '—'}</td>
                <td className="text-end ps-2">{r.soilM ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
