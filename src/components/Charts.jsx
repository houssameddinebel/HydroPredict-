import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { t } from '../i18n/translations';
import { RISK_COLORS } from '../services/predictionEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export function chartColors(dark) {
  return {
    tick: dark ? '#94a3b8' : '#64748b',
    grid: dark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)',
    legend: dark ? '#cbd5e1' : '#475569'
  };
}

const cardCls = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800';

export function dayLabel(lang, isoDate, index) {
  const d = new Date(isoDate + 'T00:00:00');
  const wd = t(lang, 'weekDays')[d.getDay()];
  if (index === 0) return `${t(lang, 'today')} • ${wd}`;
  if (index === 1) return `${t(lang, 'tomorrow')} • ${wd}`;
  return `${wd} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function TempChart({ lang, daily, dark }) {
  const c = chartColors(dark);
  const labels = daily.time.map((d, i) => dayLabel(lang, d, i));
  const data = {
    labels,
    datasets: [
      { label: 'Tmax °C', data: daily.tmax, borderColor: '#f87171', backgroundColor: '#f87171', tension: 0.35 },
      { label: 'Tmin °C', data: daily.tmin, borderColor: '#38bdf8', backgroundColor: '#38bdf8', tension: 0.35 }
    ]
  };
  const options = {
    responsive: true,
    scales: {
      x: { ticks: { color: c.tick }, grid: { color: c.grid } },
      y: { ticks: { color: c.tick }, grid: { color: c.grid } }
    },
    plugins: { legend: { position: 'bottom', labels: { color: c.legend } } }
  };
  return (
    <div className={cardCls}>
      <h3 className="font-bold mb-3">{t(lang, 'tempTrend')}</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export function WaterChart({ lang, daily, prediction, dark }) {
  const c = chartColors(dark);
  const labels = daily.time.map((d, i) => dayLabel(lang, d, i));
  const data = {
    labels,
    datasets: [
      {
        label: `${t(lang, 'waterNeedLabel')} %`,
        data: prediction.days.map((d) => d.need),
        backgroundColor: prediction.days.map((d) => RISK_COLORS[d.risk].hex),
        borderRadius: 8
      }
    ]
  };
  return (
    <div className={cardCls}>
      <h3 className="font-bold mb-3">{t(lang, 'waterNeed')}</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          scales: {
            x: { ticks: { color: c.tick }, grid: { color: c.grid } },
            y: { min: 0, max: 100, title: { display: true, text: '%', color: c.tick }, ticks: { color: c.tick }, grid: { color: c.grid } }
          },
          plugins: { legend: { display: false } }
        }}
      />
      <div className="mt-4 grid gap-2">
        {prediction.days.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-2 text-sm border-b border-slate-100 last:border-0 py-1.5 dark:border-slate-800">
            <span className="font-semibold">{labels[i]}</span>
            <span className="text-gray-500 dark:text-slate-400 tabular-nums">
              {daily.tmax[i]}° / {daily.precip[i]}mm / ET₀ {daily.et0[i]}mm
            </span>
            <span className={`font-bold ${d.risk === 'high' ? 'text-red-500' : d.risk === 'moderate' ? 'text-orange-500' : 'text-green-500'}`}>
              {d.need}% — {t(lang, d.adviceKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SoilChart({ lang, daily, dark }) {
  const c = chartColors(dark);
  const labels = daily.time.map((d, i) => dayLabel(lang, d, i));
  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: `${t(lang, 'soilMoist')} %`,
        data: (daily.soilMoist || []).map((v) => (v != null ? Number((v * 100).toFixed(1)) : null)),
        borderColor: '#34d399',
        backgroundColor: '#34d399',
        tension: 0.35,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: `${t(lang, 'precipitation')} mm`,
        data: daily.precip,
        backgroundColor: '#38bdf8',
        borderRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };
  return (
    <div className={cardCls}>
      <h3 className="font-bold mb-3">{t(lang, 'soilChart')}</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          scales: {
            x: { ticks: { color: c.tick }, grid: { color: c.grid } },
            y: { min: 0, title: { display: true, text: '%', color: c.tick }, ticks: { color: c.tick }, grid: { color: c.grid } },
            y1: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'mm', color: c.tick }, ticks: { color: c.tick } }
          },
          plugins: { legend: { position: 'bottom', labels: { color: c.legend } } }
        }}
      />
    </div>
  );
}
