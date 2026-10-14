import React from 'react';
import { CROP_GUIDES, PESTS, FERTILIZERS } from '../data/agronomy';
import { getCropById } from '../data/crops';
import { t } from '../i18n/translations';
import { pestRiskFromDay, fertigationAdvice, phenologyStage } from '../services/agronomyService';

const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800';

export function CropGuide({ lang, cropId }) {
  const crop = getCropById(cropId);
  const guide = CROP_GUIDES.find((g) => g.id === cropId);
  return (
    <div className={card}>
      <h3 className="font-bold mb-2">{t(lang, 'cropGuideTitle')} — {crop.name[lang]} (Kc {crop.kc})</h3>
      {guide ? (
        <>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{guide.desc[lang]}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {guide.stages[lang].map((s, i) => (
              <span key={i} className="text-xs font-bold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 dark:bg-emerald-950 dark:border-emerald-800">{i + 1}. {s}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs tabular-nums">
            <div className="bg-slate-50 rounded-xl p-2 dark:bg-slate-800">Kc ini/mid/fin<br /><strong>{guide.kcIni} / {guide.kcMid} / {guide.kcEnd}</strong></div>
            <div className="bg-slate-50 rounded-xl p-2 dark:bg-slate-800">GDD récolte<br /><strong>{guide.gddHarvest}</strong></div>
            <div className="bg-slate-50 rounded-xl p-2 dark:bg-slate-800">Besoin saison<br /><strong>{guide.waterMm} mm</strong></div>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">Kc {crop.kc} · cycle ~{crop.cycle} j · racines {crop.rootCm} cm. Fiche détaillée bientôt.</p>
      )}
      <div className="mt-3">
        <h4 className="text-sm font-bold mb-1">{t(lang, 'cropGuideTitle')} — {CROP_GUIDES.length} fiches</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {CROP_GUIDES.map((g) => (
            <div key={g.id} className="text-xs border border-slate-100 rounded-xl p-2.5 dark:border-slate-700">
              <strong>{getCropById(g.id)?.name[lang] || g.id}</strong>
              <span className="text-gray-500"> · {g.waterMm} mm/saison · GDD {g.gddHarvest}</span>
              <p className="text-gray-500 dark:text-slate-400 mt-0.5">{g.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PestRisks({ lang, cropId, days }) {
  const list = PESTS.filter((p) => p.crop === cropId || p.crop === 'vegetables');
  return (
    <div className={card}>
      <h3 className="font-bold mb-2">{t(lang, 'pestsTitle')} ({list.length})</h3>
      <div className="grid gap-2">
        {(list.length ? list : PESTS.slice(0, 4)).map((p) => {
          const worst = Math.max(...days.map((d) => pestRiskFromDay({ tavg: d.tavg, rhMax: d.rhMax }).score));
          const lvl = worst >= 75 ? '🔴' : worst >= 45 ? '🟠' : '🟢';
          return (
            <div key={p.id} className="flex gap-3 text-sm border border-slate-100 rounded-xl p-3 dark:border-slate-700">
              <span className="text-lg">{lvl}</span>
              <div>
                <strong>{p.name[lang]}</strong>
                <span className="text-xs text-gray-500"> · {p.tMin}–{p.tMax}°C + HR≥{p.rhMin}% · score {Math.round(worst)}</span>
                <p className="text-gray-600 dark:text-slate-300 text-xs mt-0.5">{p.advice[lang]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FertiPheno({ lang, cropId, cumulGDD, dayNeed, soilId }) {
  const ph = phenologyStage(cropId, cumulGDD);
  const fert = FERTILIZERS.find((f) => f.crop === cropId);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className={card}>
        <h3 className="font-bold mb-2">{t(lang, 'phenoTitle')}</h3>
        <div className="text-2xl font-extrabold">{ph.stage}</div>
        <div className="text-xs text-gray-500 mb-2 tabular-nums">{cumulGDD} / {ph.total} GDD · {ph.progress}%</div>
        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${ph.progress}%` }} />
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold mb-2">{t(lang, 'fertiTitle')}</h3>
        <p className="text-sm">{fert ? fert.plan[lang] : 'EC 1.5–2.0, pH 5.8–6.5.'}</p>
        <p className="text-xs text-gray-500 mt-2">💧 {fertigationAdvice(cropId, dayNeed, soilId)}</p>
      </div>
    </div>
  );
}
