// Open-Meteo API client — no API key required.
// Docs: https://open-meteo.com/en/docs
// Daily: Tmax/Tmin, rain sum + probability, ET0, wind max, sunshine.
// Hourly (aggregated per day): humidity, soil temperature + soil moisture.

const avg = (arr) => {
  const v = arr.filter((x) => x !== null && x !== undefined);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

export async function fetchHydroWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,wind_speed_10m_max,sunshine_duration',
    hourly: 'temperature_2m,relative_humidity_2m,soil_temperature_6cm,soil_moisture_3_9cm,precipitation',
    timezone: 'Africa/Casablanca',
    forecast_days: '7'
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const json = await res.json();

  // Aggregate hourly series into per-day values.
  const byDate = {};
  const hTime = json.hourly?.time || [];
  const hRh = json.hourly?.relative_humidity_2m || [];
  const hSt = json.hourly?.soil_temperature_6cm || [];
  const hSm = json.hourly?.soil_moisture_3_9cm || [];
  hTime.forEach((ts, i) => {
    const d = ts.slice(0, 10);
    if (!byDate[d]) byDate[d] = { rh: [], st: [], sm: [] };
    if (hRh[i] != null) byDate[d].rh.push(hRh[i]);
    if (hSt[i] != null) byDate[d].st.push(hSt[i]);
    if (hSm[i] != null) byDate[d].sm.push(hSm[i]);
  });

  const dates = json.daily?.time || [];
  const agg = dates.map((d) => {
    const g = byDate[d] || { rh: [], st: [], sm: [] };
    return {
      rhMax: g.rh.length ? Math.max(...g.rh) : null,
      soilTemp: avg(g.st) !== null ? Number(avg(g.st).toFixed(1)) : null,
      soilMoist: avg(g.sm) !== null ? Number(avg(g.sm).toFixed(3)) : null
    };
  });

  return {
    current: {
      temp: json.current?.temperature_2m,
      humidity: json.current?.relative_humidity_2m,
      precipitation: json.current?.precipitation,
      weatherCode: json.current?.weather_code,
      wind: json.current?.wind_speed_10m,
      time: json.current?.time
    },
    daily: {
      time: dates,
      tmax: json.daily?.temperature_2m_max || [],
      tmin: json.daily?.temperature_2m_min || [],
      precip: json.daily?.precipitation_sum || [],
      precipProb: json.daily?.precipitation_probability_max || [],
      et0: json.daily?.et0_fao_evapotranspiration || [],
      windMax: json.daily?.wind_speed_10m_max || [],
      sunshine: json.daily?.sunshine_duration || [],
      rhMax: agg.map((a) => a.rhMax),
      soilTemp: agg.map((a) => a.soilTemp),
      soilMoist: agg.map((a) => a.soilMoist)
    },
    raw: json
  };
}

export function weatherCodeLabel(code) {
  if (code === 0) return { fr: 'Ciel dégagé', ar: 'سماء صافية' };
  if ([1, 2, 3].includes(code)) return { fr: 'Partiellement nuageux', ar: 'غائم جزئياً' };
  if ([45, 48].includes(code)) return { fr: 'Brouillard', ar: 'ضباب' };
  if ([51, 53, 55].includes(code)) return { fr: 'Bruine', ar: 'رذاذ' };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { fr: 'Pluie', ar: 'مطر' };
  if ([71, 73, 75, 77].includes(code)) return { fr: 'Neige', ar: 'ثلج' };
  if ([95, 96, 99].includes(code)) return { fr: 'Orage', ar: 'عاصفة رعدية' };
  return { fr: 'Variable', ar: 'متغير' };
}
