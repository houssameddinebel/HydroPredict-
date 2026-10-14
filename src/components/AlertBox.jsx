import React from 'react';
import { TriangleAlert, Info, CircleCheck } from 'lucide-react';
import { t } from '../i18n/translations';

export default function AlertBox({ lang, alerts, synthesis }) {
  return (
    <section id="alerts" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="font-bold text-lg">{t(lang, 'alerts')}</h2>
        {synthesis && (
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {t(lang, 'globalRisk')}:{' '}
            <strong
              className={
                synthesis.globalRisk === 'high'
                  ? 'text-red-500'
                  : synthesis.globalRisk === 'moderate'
                    ? 'text-orange-500'
                    : 'text-green-500'
              }
            >
              {synthesis.globalRisk === 'high'
                ? t(lang, 'statusHigh')
                : synthesis.globalRisk === 'moderate'
                  ? t(lang, 'statusModerate')
                  : t(lang, 'statusNormal')}
            </strong>
          </span>
        )}
      </div>

      <div className="grid gap-2">
        {alerts.map((a, i) => {
          const Icon = a.level === 'high' ? TriangleAlert : a.level === 'moderate' ? Info : CircleCheck;
          const style =
            a.level === 'high'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/60 dark:border-red-900 dark:text-red-200'
              : a.level === 'moderate'
                ? 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/60 dark:border-orange-900 dark:text-orange-200'
                : 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/60 dark:border-green-900 dark:text-green-200';
          return (
            <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${style}`}>
              <Icon size={18} className="mt-0.5 shrink-0" />
              <span className="leading-relaxed">{t(lang, a.key)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">💧 {t(lang, 'dripTip')}</p>
    </section>
  );
}
