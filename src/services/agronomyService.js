// Agronomic services: soil water balance, pest risk, phenology, fertigation, economy.

export function soilWaterBalance(daily, soilRuMmM = 140, rootCm = 80, etcSeries = []) {
  // Simple bucket: RU = ruMmM * rootM. Start at 70% full.
  const RU = soilRuMmM * (rootCm / 100);
  let stock = RU * 0.7;
  return daily.time.map((date, i) => {
    const rain = daily.precip?.[i] || 0;
    const etc = etcSeries[i] ?? 4;
    stock = Math.min(RU, Math.max(0, stock + rain * 0.8 - etc));
    const pct = RU > 0 ? Math.round((stock / RU) * 100) : 0;
    return { date, stock: Number(stock.toFixed(1)), pct, RU: Number(RU.toFixed(0)), stress: pct < 30 };
  });
}

export function pestRiskFromDay({ tavg, rhMax }) {
  // Returns 0-100 score + level.
  let score = 0;
  if (rhMax != null && tavg >= 12 && tavg <= 26) {
    score = rhMax >= 90 ? 85 : rhMax >= 80 ? 60 : rhMax >= 65 ? 35 : 10;
  } else if (tavg > 26 && rhMax >= 70) score = 40;
  const level = score >= 75 ? 'high' : score >= 45 ? 'moderate' : 'normal';
  return { score, level };
}

export function phenologyStage(cropId, cumulGDD) {
  // Very simplified thresholds per crop.
  const tables = {
    tomato: [[200, 'Pépinière'], [500, 'Croissance'], [900, 'Floraison'], [1300, 'Récolte']],
    wheat: [[300, 'Levée'], [700, 'Tallage'], [1200, 'Montaison'], [1800, 'Épiaison']],
    citrus: [[800, 'Floraison'], [1500, 'Nouaison'], [2000, 'Grossissement'], [2500, 'Maturation']],
    dates: [[1000, 'Pollinisation'], [2000, 'Kimri'], [2800, 'Khalal'], [3500, 'Tamar']]
  };
  const steps = tables[cropId] || [[300, 'Levée'], [800, 'Croissance'], [1300, 'Floraison'], [2000, 'Maturation']];
  let stage = steps[0][1];
  for (const [th, name] of steps) if (cumulGDD >= th * 0.0 + th) stage = name;
  // progress = cumul / last threshold
  const total = steps[steps.length - 1][0];
  return { stage, progress: Math.min(100, Math.round((cumulGDD / total) * 100)), total };
}

export function fertigationAdvice(cropId, dayNeed, soilId) {
  const base = {
    tomato: 'EC 1.8–2.2, pH 5.8–6.2. NPK goutte-à-goutte.',
    citrus: 'EC 1.5–2.0. Fractionner azote.',
    wheat: 'Urée 40 kg/ha si pluie < 10 mm.',
    default: 'EC 1.5–2.0, surveillez lessivage si pluie > 15 mm.'
  };
  let txt = base[cropId] || base.default;
  if (soilId === 'saline') txt += ' + lessivage 10% (sel).';
  if (dayNeed >= 80) txt += ' Doublez la fréquence, pas la concentration.';
  return txt;
}

export function economyReport({ totalM3, savedM3, price = 2, energyKwhM3 = 0.6, energyPrice = 1.2, yieldQHa = 60, sellPriceQ = 400, area = 1 }) {
  const waterCost = totalM3 * price;
  const energyCost = totalM3 * energyKwhM3 * energyPrice;
  const savedMAD = savedM3 * price;
  const revenue = yieldQHa * sellPriceQ * area;
  const margin = revenue - waterCost - energyCost;
  return {
    waterCost: Math.round(waterCost), energyCost: Math.round(energyCost),
    savedMAD: Math.round(savedMAD), revenue: Math.round(revenue), margin: Math.round(margin),
    costPerHa: area ? Math.round((waterCost + energyCost) / area) : 0
  };
}

export function exportCSV(filename, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
