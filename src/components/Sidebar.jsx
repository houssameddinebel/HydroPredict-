import React from 'react';
import { LayoutDashboard, Map as MapIcon, MapPin, Columns3, CalendarDays, CalendarCheck, Sprout, Droplets, TrendingUp, Tractor, Bell, History } from 'lucide-react';
import Logo from './Logo';
import { t } from '../i18n/translations';

export default function Sidebar({ lang, active, onNavigate }) {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: t(lang, 'dashboard') },
    { id: 'map', icon: MapIcon, label: t(lang, 'mapTab') },
    { id: 'regions', icon: MapPin, label: t(lang, 'regions') },
    { id: 'compare', icon: Columns3, label: t(lang, 'compareTab') },
    { id: 'forecast', icon: CalendarDays, label: t(lang, 'forecast') },
    { id: 'plan', icon: CalendarCheck, label: t(lang, 'planTab') },
    { id: 'agro', icon: Sprout, label: t(lang, 'agroTab') },
    { id: 'water', icon: Droplets, label: t(lang, 'waterTab') },
    { id: 'market', icon: TrendingUp, label: t(lang, 'marketTab') },
    { id: 'farm', icon: Tractor, label: t(lang, 'farmTab') },
    { id: 'alerts', icon: Bell, label: t(lang, 'alerts') },
    { id: 'history', icon: History, label: t(lang, 'history') }
  ];

  return (
    <aside className="hidden md:flex w-60 shrink-0 min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950 text-white flex-col p-5 gap-1.5 border-e border-white/5 overflow-y-auto">
      <div className="flex items-center gap-3 mb-5">
        <Logo size={40} />
        <div>
          <div className="font-bold leading-tight">HydroPredict</div>
          <div className="text-xs text-emerald-200">Souss-Massa • hydro-predict.ma</div>
        </div>
      </div>
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition text-start ${
            active === id ? 'bg-emerald-600 font-semibold' : 'hover:bg-emerald-800 text-emerald-100'
          }`}
        >
          <Icon size={17} className="shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
      <div className="mt-auto text-xs text-emerald-300 leading-relaxed pt-5">
        {t(lang, 'footer')}
      </div>
    </aside>
  );
}
