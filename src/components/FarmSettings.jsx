import React from 'react';
import { Sprout, Layers, Ruler, Coins } from 'lucide-react';
import { CROPS, SOILS } from '../data/crops';
import { t } from '../i18n/translations';

const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100';

export default function FarmSettings({ lang, cropId, soilId, area, price, onCrop, onSoil, onArea, onPrice }) {
  return (
    <section id="parcelle" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-bold text-lg mb-4">{t(lang, 'farmSettings')}</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
            <Sprout size={15} className="text-emerald-500" />
            {t(lang, 'crop')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CROPS.map((c) => (
              <button
                key={c.id}
                onClick={() => onCrop(c.id)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                  c.id === cropId
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-600'
                }`}
                title={`Kc ${c.kc}`}
              >
                {c.name[lang]} <span className="opacity-70">· Kc {c.kc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
            <Layers size={15} className="text-emerald-500" />
            {t(lang, 'soil')}
          </div>
          <div className="flex flex-col gap-1.5">
            {SOILS.map((s) => (
              <button
                key={s.id}
                onClick={() => onSoil(s.id)}
                className={`text-start text-xs px-3 py-2 rounded-xl border transition ${
                  s.id === soilId
                    ? 'border-emerald-500 bg-emerald-50 font-bold dark:bg-emerald-950/60 dark:border-emerald-500'
                    : 'border-slate-200 bg-slate-50 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600'
                }`}
              >
                {s.name[lang]}
                <span className="block font-normal text-gray-500 dark:text-slate-400">{s.tip[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
              <Ruler size={15} className="text-emerald-500" />
              {t(lang, 'area')}
            </div>
            <input
              type="number" min="0.1" max="5000" step="0.1"
              value={area}
              onChange={(e) => onArea(e.target.value)}
              className={inputCls}
            />
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">1 mm / ha = 10 m³</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">
              <Coins size={15} className="text-emerald-500" />
              {t(lang, 'waterPrice')}
            </div>
            <input
              type="number" min="0" max="100" step="0.1"
              value={price}
              onChange={(e) => onPrice(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
