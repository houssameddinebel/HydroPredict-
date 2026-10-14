// AI prediction engine (agronomic heuristic) — extended farmer edition.
// Per day: water-need %, crop ETc, net dose (mm), GDD, frost / heat / wind /
// fungal flags, irrigation window.
// Week: totals (dose mm, volume m³ for the field), savings vs fixed schedule.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const r1 = (v) => Math.round(v * 10) / 10;

export function predictDay(
  { tmax, tmin, precip, et0, precipProb, windMax, rhMax, soilTemp, soilMoist },
  kc = 1
) {
  const tavg = (tmax + tmin) / 2;
  const et = et0 ?? 4.5;
  const rain = precip || 0;

  // 1) Water-need % (Souss-tuned legacy score, keeps Green/Orange/Red).
  let need = 20 + (tavg - 20) * 4 + et * 8 - rain * 12;
  need = Math.round(clamp(need, 5, 100));

  let adviceKey = 'advice_normal';
  let risk = 'normal';

  if (rain >= 5) {
    adviceKey = 'advice_skip';
    risk = 'normal';
    need = Math.min(need, 25);
  } else if (need >= 80 || (tmax >= 34 && rain < 1)) {
    adviceKey = 'advice_critical';
    risk = 'high';
  } else if (need >= 60 || (tmax >= 30 && et > 5.5)) {
    adviceKey = 'advice_reinforced';
    risk = tmax >= 32 && rain < 1 ? 'high' : 'moderate';
  } else if (need >= 40) {
    adviceKey = 'advice_normal';
    risk = tmax >= 29 && rain < 2 ? 'moderate' : 'normal';
  } else {
    adviceKey = 'advice_light';
    risk = 'normal';
  }

  // 2) Crop water balance: ETc − effective rain (80%).
  const etc = r1(et * kc);
  const doseMm = r1(Math.max(0, etc - rain * 0.8));

  // 3) Phenology + hazards.
  const gdd = r1(Math.max(0, tavg - 10)); // base 10 °C
  const frost = tmin <= 2;
  const heatwave = tmax >= 38;
  const windy = (windMax || 0) >= 40;
  const heavyRain = rain >= 15;
  let fungal = 'normal';
  if (rhMax != null && tavg >= 12 && tavg <= 26) {
    if (rhMax >= 90) fungal = 'high';
    else if (rhMax >= 80) fungal = 'moderate';
  }

  const soilMoisture = Math.round(clamp(100 - need * 0.85, 5, 95));
  const window = frost ? 'late' : 'dawn';

  return {
    tmax, tmin, tavg: Number(tavg.toFixed(1)), need, adviceKey, risk, soilMoisture,
    etc, doseMm, gdd, frost, heatwave, windy, heavyRain, fungal, window,
    precipProb: precipProb ?? null, rhMax: rhMax ?? null,
    soilTemp: soilTemp ?? null, soilMoist: soilMoist ?? null
  };
}

export function predictWeek(daily, kc = 1, areaHa = 1) {
  const days = daily.time.map((date, i) =>
    predictDay(
      {
        tmax: daily.tmax[i],
        tmin: daily.tmin[i],
        precip: daily.precip[i],
        et0: daily.et0[i],
        precipProb: daily.precipProb?.[i],
        windMax: daily.windMax?.[i],
        rhMax: daily.rhMax?.[i],
        soilTemp: daily.soilTemp?.[i],
        soilMoist: daily.soilMoist?.[i]
      },
      kc
    )
  );

  const totalRain = daily.precip.reduce((a, b) => a + (b || 0), 0);
  const avgTemp = daily.tmax.reduce((a, b, i) => a + (b + daily.tmin[i]) / 2, 0) / daily.time.length;
  const avgET0 = daily.et0.reduce((a, b) => a + (b || 0), 0) / daily.time.length;
  const highDays = days.filter((d) => d.risk === 'high').length;
  const modDays = days.filter((d) => d.risk === 'moderate').length;

  const totalDoseMm = r1(days.reduce((a, d) => a + d.doseMm, 0));
  const totalM3 = r1(totalDoseMm * 10 * (areaHa || 1)); // 1 mm/ha = 10 m³
  const totalGDD = r1(days.reduce((a, d) => a + d.gdd, 0));
  const baselineMm = 6 * daily.time.length; // naive fixed schedule
  const savedMm = r1(Math.max(0, baselineMm - totalDoseMm));
  const savedM3 = r1(savedMm * 10 * (areaHa || 1));

  let globalRisk = 'normal';
  if (highDays >= 2 || (avgTemp > 30 && totalRain < 2)) globalRisk = 'high';
  else if (highDays >= 1 || modDays >= 2 || totalRain < 5) globalRisk = 'moderate';

  return {
    days,
    synthesis: {
      totalRain: Number(totalRain.toFixed(1)),
      avgTemp: Number(avgTemp.toFixed(1)),
      avgET0: Number(avgET0.toFixed(2)),
      highDays,
      modDays,
      globalRisk,
      totalDoseMm,
      totalM3,
      totalGDD,
      savedMm,
      savedM3,
      frostDays: days.filter((d) => d.frost).length,
      heatDays: days.filter((d) => d.heatwave || d.tmax >= 35).length,
      windyDays: days.filter((d) => d.windy).length,
      rainyDays: daily.precip.filter((p) => (p || 0) >= 1).length,
      maxRainProb: Math.max(0, ...days.map((d) => d.precipProb || 0)),
      totalSunH: r1((daily.sunshine || []).reduce((a, b) => a + (b || 0), 0) / 3600)
    }
  };
}

// Smart alerts derived from synthesis + daily extremes.
export function buildAlerts(synthesis, daily, days) {
  const alerts = [];
  const maxT = Math.max(...daily.tmax);
  if (synthesis.frostDays > 0) alerts.push({ type: 'frost', key: 'alertFrost', level: 'high' });
  if (maxT >= 32) alerts.push({ type: 'heat', key: 'alertHeat', level: 'high' });
  if (synthesis.windyDays > 0) alerts.push({ type: 'wind', key: 'alertWind', level: 'moderate' });
  if ((days || []).some((d) => d.fungal === 'high'))
    alerts.push({ type: 'fungal', key: 'alertFungal', level: 'high' });
  else if ((days || []).some((d) => d.fungal === 'moderate'))
    alerts.push({ type: 'fungal', key: 'alertFungal', level: 'moderate' });
  if ((days || []).some((d) => d.heavyRain))
    alerts.push({ type: 'rain', key: 'alertHeavyRain', level: 'moderate' });
  if (synthesis.totalRain < 2) alerts.push({ type: 'drought', key: 'alertNoRain', level: synthesis.globalRisk });
  if (alerts.length === 0) alerts.push({ type: 'good', key: 'alertGood', level: 'normal' });
  return alerts;
}

export const RISK_COLORS = {
  normal: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', hex: '#16a34a', pillDark: 'dark:bg-green-950 dark:text-green-300' },
  moderate: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', hex: '#ea580c', pillDark: 'dark:bg-orange-950 dark:text-orange-300' },
  high: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', hex: '#dc2626', pillDark: 'dark:bg-red-950 dark:text-red-300' }
};
