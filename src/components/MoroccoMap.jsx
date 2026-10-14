import React from 'react';
import { REGIONS } from '../data/regions';
import { t } from '../i18n/translations';

// Lightweight SVG map of Morocco (no external dep).
// x: lon -17.5..-0.5 → 4..96%, y: lat 21..36 → 92..4%
const X = (lon) => 4 + ((lon + 17.5) / 17) * 92;
const Y = (lat) => 4 + ((36 - lat) / 15) * 88;

export default function MoroccoMap({ lang, selectedId, onSelect, risks = {} }) {
  const color = (id) => {
    const r = risks[id];
    if (r === 'high') return '#ef4444';
    if (r === 'moderate') return '#f59e0b';
    return '#10b981';
  };
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-bold text-lg">{t(lang, 'mapTitle')}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{t(lang, 'mapHint')}</p>
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-950" style={{ aspectRatio: '16/10' }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <ellipse cx="50" cy="48" rx="34" ry="36" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.6" className="text-slate-500" />
          <ellipse cx="52" cy="50" rx="26" ry="28" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.6" className="text-slate-500" />
        </svg>
        {REGIONS.map((r) => {
          const active = r.id === selectedId;
          return (
            <button
              key={r.id}
              title={`${r.name[lang]} — ${r.province}`}
              onClick={() => onSelect(r.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${X(r.lon)}%`, top: `${Y(r.lat)}%` }}
            >
              <span
                className={`block rounded-full border-2 border-white shadow transition group-hover:scale-125 ${active ? 'ring-2 ring-emerald-500' : ''}`}
                style={{ width: active ? 16 : 11, height: active ? 16 : 11, background: color(r.id) }}
              />
              {(active || ['agadir', 'taroudant', 'fes', 'tanger', 'dakhla', 'errachidia'].includes(r.id)) && (
                <span className={`absolute top-4 start-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-emerald-600 text-white' : 'bg-white/90 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                  {r.name[lang]}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 text-xs text-gray-500 dark:text-slate-400">
        <span>🟢 Normal</span><span>🟠 Modéré</span><span>🔴 Stress</span>
        <span className="ms-auto tabular-nums">{REGIONS.length} villes · 12 régions</span>
      </div>
    </section>
  );
}
