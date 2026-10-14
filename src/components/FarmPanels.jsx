import React, { useEffect, useState } from 'react';
import { t } from '../i18n/translations';
import { CROPS, SOILS } from '../data/crops';
import { exportCSV } from '../services/agronomyService';

const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };

export function ParcelsManager({ lang, onUse }) {
  const [parcels, setParcels] = useState(() => load('hydropredict.parcels', [
    { id: 1, name: 'Souss Tomate S1', crop: 'tomato', soil: 'sandy', area: 2.5 },
    { id: 2, name: 'Taroudant Agrumes', crop: 'citrus', soil: 'loam', area: 4 },
    { id: 3, name: 'Tiznit Argan', crop: 'argan', soil: 'clay', area: 6 }
  ]));
  const [name, setName] = useState('');
  useEffect(() => localStorage.setItem('hydropredict.parcels', JSON.stringify(parcels)), [parcels]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">{t(lang, 'parcelsTitle')} ({parcels.length})</h3>
        <button onClick={() => exportCSV('parcelles.csv', [['nom', 'culture', 'sol', 'ha'], ...parcels.map((p) => [p.name, p.crop, p.soil, p.area])])}
          className="text-xs font-bold border rounded-lg px-3 py-1.5 hover:border-emerald-500 dark:border-slate-700">⬇ {t(lang, 'exportCSV')}</button>
      </div>
      <div className="grid gap-2">
        {parcels.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-sm border border-slate-100 rounded-xl p-2.5 dark:border-slate-700">
            <div className="flex-1"><strong>{p.name}</strong><span className="text-xs text-gray-500"> · {p.crop} · {p.soil} · {p.area} ha</span></div>
            <button onClick={() => onUse?.(p)} className="text-xs bg-emerald-600 text-white rounded-lg px-3 py-1.5 font-bold">→</button>
            <button onClick={() => setParcels(parcels.filter((x) => x.id !== p.id))} className="text-xs text-red-500 px-2">✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, 'parcelName')}
          className="flex-1 border rounded-xl px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700" />
        <button onClick={() => { if (!name.trim()) return; setParcels([...parcels, { id: Date.now(), name: name.trim(), crop: 'tomato', soil: 'loam', area: 1 }]); setName(''); }}
          className="bg-emerald-600 text-white text-sm font-bold px-4 rounded-xl">+ {t(lang, 'addParcel')}</button>
      </div>
      <p className="text-[11px] text-gray-400 mt-2">{CROPS.length} cultures · {SOILS.length} sols référencés</p>
    </div>
  );
}

export function TasksJournal({ lang }) {
  const [tasks, setTasks] = useState(() => load('hydropredict.tasks', [
    { id: 1, txt: 'Tour d’eau secteur A — 5h30', done: true, date: new Date().toISOString().slice(0, 10) },
    { id: 2, txt: 'Contrôle goutteurs + filtre', done: false, date: new Date().toISOString().slice(0, 10) }
  ]));
  const [txt, setTxt] = useState('');
  useEffect(() => localStorage.setItem('hydropredict.tasks', JSON.stringify(tasks)), [tasks]);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-bold mb-3">{t(lang, 'tasksTitle')} ({tasks.filter((x) => !x.done).length} ⏳)</h3>
      <div className="grid gap-1.5 mb-3">
        {tasks.map((x) => (
          <label key={x.id} className="flex items-center gap-2 text-sm border border-slate-100 rounded-xl px-3 py-2 dark:border-slate-700">
            <input type="checkbox" checked={x.done} onChange={() => setTasks(tasks.map((y) => (y.id === x.id ? { ...y, done: !y.done } : y)))} />
            <span className={x.done ? 'line-through text-gray-400' : ''}>{x.txt}</span>
            <span className="ms-auto text-[11px] text-gray-400">{x.date}</span>
            <button onClick={() => setTasks(tasks.filter((y) => y.id !== x.id))} className="text-red-400">✕</button>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={t(lang, 'taskPlaceholder')}
          className="flex-1 border rounded-xl px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700" />
        <button onClick={() => { if (!txt.trim()) return; setTasks([{ id: Date.now(), txt: txt.trim(), done: false, date: new Date().toISOString().slice(0, 10) }, ...tasks]); setTxt(''); }}
          className="bg-emerald-600 text-white text-sm font-bold px-4 rounded-xl">+ {t(lang, 'addTask')}</button>
      </div>
    </div>
  );
}
