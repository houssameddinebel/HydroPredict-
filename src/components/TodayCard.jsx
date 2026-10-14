import React from 'react';
import { t } from '../i18n/translations';
import { StatusBadge } from './StatusCards';

// Hero card: what should the farmer do TODAY, in one glance.
export default function TodayCard({ lang, regionName, cropName, day, area, soilSplits }) {
  const vol = day.doseMm * 10 * area;

  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-2xl shadow p-5 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <div className="text-emerald-200 text-xs">{t(lang, 'today')} · {regionName} · {cropName}</div>
          <h2 className="font-extrabold text-xl md:text-2xl">{t(lang, 'todayWater')}</h2>
        </div>
        <StatusBadge lang={lang} level={day.risk} />
      </div>

      <div className="flex items-end gap-6 flex-wrap">
        <div>
          <div className="text-4xl md:text-5xl font-extrabold">{day.doseMm}<span className="text-lg font-bold"> mm</span></div>
          <div className="text-emerald-200 text-sm">
            = {vol > 0 ? (soilSplits === 2 ? `2 × ${(vol / 2).toFixed(1)}` : vol.toFixed(1)) : 0} m³
          </div>
        </div>
        <div className="text-sm leading-relaxed max-w-md">
          <div className="font-bold">{day.window === 'late' ? `⚠️ ${t(lang, 'windowLate')}` : `🌅 ${t(lang, 'windowDawn')}`}</div>
          <div className="text-emerald-100">{t(lang, day.adviceKey)}</div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mt-4 text-xs text-emerald-200">
        <span>ETc {day.etc} mm</span>
        <span>🌧 {day.precip ?? 0} mm ({day.precipProb ?? 0}%)</span>
        {day.rhMax != null && <span>💧 {t(lang, 'humidityMax')} {day.rhMax}%</span>}
        {day.frost && <span className="font-bold text-red-200">❄ {t(lang, 'alertFrost')}</span>}
      </div>
    </div>
  );
}
