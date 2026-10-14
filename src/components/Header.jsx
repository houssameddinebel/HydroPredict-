import React from 'react';
import { Globe, Droplets, Sun, Moon, Home } from 'lucide-react';
import { t } from '../i18n/translations';

export default function Header({ lang, onToggleLang, regionName, dark, onToggleTheme, onHome }) {
  return (
    <header className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3 sticky top-0 z-10 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="flex items-center gap-2 min-w-0">
        <Droplets className="text-emerald-500 shrink-0" size={22} />
        <div className="min-w-0">
          <h1 className="font-bold text-sm md:text-lg truncate">{t(lang, 'appName')}</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{regionName} • {t(lang, 'tagline')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onHome && (
          <button
            onClick={onHome}
            title="hydro-predict.ma"
            className="p-2 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500"
          >
            <Home size={16} />
          </button>
        )}
        <button
          onClick={onToggleTheme}
          title={dark ? 'Light' : 'Sombre'}
          className="p-2 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onToggleLang}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
          title="FR / AR"
        >
          <Globe size={16} />
          {t(lang, 'language')}
        </button>
      </div>
    </header>
  );
}
