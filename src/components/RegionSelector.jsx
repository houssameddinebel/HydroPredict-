import React, { useMemo, useState } from 'react';
import { MapPin, Check, Search } from 'lucide-react';
import { REGIONS } from '../data/regions';
import { t } from '../i18n/translations';

export default function RegionSelector({ lang, selectedId, onSelect, onSave, saveMsg }) {
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = [];
    for (const r of REGIONS) {
      const hay = `${r.name.fr} ${r.name.ar} ${r.province} ${r.admin.fr} ${r.admin.ar}`.toLowerCase();
      if (needle && !hay.includes(needle)) continue;
      let g = out.find((g) => g.key === r.admin.fr);
      if (!g) {
        g = { key: r.admin.fr, label: r.admin[lang], cities: [] };
        out.push(g);
      }
      g.cities.push(r);
    }
    return out;
  }, [q, lang]);

  return (
    <section id="regions" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-bold text-lg mb-1">{t(lang, 'selectRegion')}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{t(lang, 'selectRegionHint')}</p>

      <div className="relative mb-4">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400 dark:text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, 'searchCity')}
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 ps-9 pe-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      {groups.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-slate-500 py-4 text-center">{t(lang, 'noCity')}</p>
      )}

      <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pe-1">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">
              {g.label} <span className="text-gray-400 dark:text-slate-500">({g.cities.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {g.cities.map((r) => {
                const active = r.id === selectedId;
                return (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`text-start rounded-xl border-2 p-2.5 transition ${
                      active
                        ? 'border-emerald-500 bg-emerald-50 shadow dark:bg-emerald-950/60 dark:border-emerald-500'
                        : 'border-slate-100 bg-slate-50 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <MapPin size={14} className={active ? 'text-emerald-500' : 'text-gray-400 dark:text-slate-500'} />
                      {active && <Check size={14} className="text-emerald-500" />}
                    </div>
                    <div className="font-bold text-sm leading-tight">{r.name[lang]}</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                      {lang === 'fr' ? r.cropsFr : r.cropsAr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onSave}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
        >
          {t(lang, 'savePreference')}
        </button>
        {saveMsg && <span className="text-sm text-emerald-600 dark:text-emerald-400">{saveMsg}</span>}
      </div>
    </section>
  );
}
