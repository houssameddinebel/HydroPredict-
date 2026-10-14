import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RegionSelector from './components/RegionSelector';
import FarmSettings from './components/FarmSettings';
import StatusCards, { StatusBadge } from './components/StatusCards';
import StatCards from './components/StatCards';
import TodayCard from './components/TodayCard';
import AlertBox from './components/AlertBox';
import FieldDetails from './components/FieldDetails';
import IrrigationPlan from './components/IrrigationPlan';
import HistoryPanel from './components/HistoryPanel';
import Landing from './pages/Landing';
import MoroccoMap from './components/MoroccoMap';
import RegionCompare from './components/RegionCompare';
import HourlyTable from './components/HourlyTable';
import SoilWater from './components/SoilWater';
import CostsAnalysis from './components/CostsAnalysis';
import { CropGuide, PestRisks, FertiPheno } from './components/AgroPanels';
import { ParcelsManager, TasksJournal } from './components/FarmPanels';
import { WaterResources, MarketPrices, ClimateNormals } from './components/WaterMarket';
import { TempChart, WaterChart, SoilChart } from './components/Charts';
import { REGIONS, getRegionById } from './data/regions';
import { getCropById, getSoilById } from './data/crops';
import { t } from './i18n/translations';
import { fetchHydroWeather } from './services/weatherApi';
import { predictWeek, buildAlerts } from './services/predictionEngine';
import { saveZonePreference, saveForecastLog } from './services/backendApi';
import { Loader2 } from 'lucide-react';

// Tabbed layout: dashboard · map · regions · compare · forecast · plan · agro · water · market · farm · alerts · history
// Dark theme by default, toggleable in the header (persisted).
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('hydropredict.lang') || 'fr');
  const [theme, setTheme] = useState(() => localStorage.getItem('hydropredict.theme') || 'dark');
  const [regionId, setRegionId] = useState(() => localStorage.getItem('hydropredict.region') || 'agadir');
  const [cropId, setCropId] = useState(() => localStorage.getItem('hydropredict.crop') || 'tomato');
  const [soilId, setSoilId] = useState(() => localStorage.getItem('hydropredict.soil') || 'loam');
  const [area, setArea] = useState(() => Number(localStorage.getItem('hydropredict.area') || 2.5));
  const [price, setPrice] = useState(() => Number(localStorage.getItem('hydropredict.price') || 2));
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [view, setView] = useState('dashboard');
  const [landing, setLanding] = useState(true);

  const dark = theme === 'dark';
  const region = useMemo(() => getRegionById(regionId), [regionId]);
  const crop = useMemo(() => getCropById(cropId), [cropId]);
  const soil = useMemo(() => getSoilById(soilId), [soilId]);
  const safeArea = area > 0 && area <= 5000 ? area : 1;
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('hydropredict.lang', lang);
  }, [lang, isRTL]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('hydropredict.theme', theme);
  }, [dark, theme]);

  const load = useCallback(async (reg) => {
    setLoading(true);
    setError('');
    try {
      const w = await fetchHydroWeather(reg.lat, reg.lon);
      setWeather(w);
    } catch (e) {
      setError(t(lang, 'errorFetch'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    load(region);
  }, [region, load]);

  const prediction = useMemo(() => {
    if (!weather) return null;
    return predictWeek(weather.daily, crop.kc, safeArea);
  }, [weather, crop, safeArea]);

  const alerts = useMemo(() => {
    if (!weather || !prediction) return [];
    return buildAlerts(prediction.synthesis, weather.daily, prediction.days);
  }, [weather, prediction]);

  const handleSelect = (id) => {
    setRegionId(id);
    localStorage.setItem('hydropredict.region', id);
    setSaveMsg('');
  };

  const handleSave = async () => {
    const res = await saveZonePreference({ userId: 1, regionId, crop: cropId, areaHa: safeArea });
    setSaveMsg(res.ok ? t(lang, 'saved') : t(lang, 'saveError'));
    if (weather && prediction) {
      saveForecastLog({
        regionId,
        risk: prediction.synthesis.globalRisk,
        forecastJson: { current: weather.current, synthesis: prediction.synthesis, crop: cropId }
      });
    }
  };

  const useParcel = (p) => {
    setCropId(p.crop); localStorage.setItem('hydropredict.crop', p.crop);
    setSoilId(p.soil); localStorage.setItem('hydropredict.soil', p.soil);
    setArea(p.area); localStorage.setItem('hydropredict.area', String(p.area));
    setView('dashboard');
    window.scrollTo({ top: 0 });
  };

  const ready = weather && prediction && !loading;
  const risks = useMemo(() => (prediction ? { [regionId]: prediction.synthesis.globalRisk } : {}), [prediction, regionId]);
  const nav = (id) => { setView(id); window.scrollTo({ top: 0 }); };

  if (landing) {
    return (
      <Landing
        lang={lang}
        dark={dark}
        onToggleLang={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
        onToggleTheme={() => setTheme(dark ? 'light' : 'dark')}
        onEnter={() => { setLanding(false); window.scrollTo({ top: 0 }); }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar lang={lang} active={view} onNavigate={nav} />

      <div className="flex-1 min-w-0">
        <Header
          lang={lang}
          onToggleLang={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          regionName={`${region.name[lang]} (${region.lat}, ${region.lon})`}
          dark={dark}
          onToggleTheme={() => setTheme(dark ? 'light' : 'dark')}
          onHome={() => { setLanding(true); window.scrollTo({ top: 0 }); }}
        />

        {/* Mobile nav (all 12 tabs) */}
        <div className="md:hidden flex gap-1.5 overflow-x-auto px-3 py-2 bg-white border-b dark:bg-slate-900 dark:border-slate-800 no-print">
          {['dashboard', 'map', 'regions', 'compare', 'forecast', 'plan', 'agro', 'water', 'market', 'farm', 'alerts', 'history'].map((id) => (
            <button key={id} onClick={() => nav(id)}
              className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full border ${view === id ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
              {t(lang, id === 'map' ? 'mapTab' : id === 'compare' ? 'compareTab' : id === 'agro' ? 'agroTab' : id === 'water' ? 'waterTab' : id === 'market' ? 'marketTab' : id === 'farm' ? 'farmTab' : id === 'plan' ? 'planTab' : id)}
            </button>
          ))}
        </div>

        <main className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-4" key={view}>
          <div className="animate-fadeIn flex flex-col gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-white border border-slate-200 rounded-2xl p-5 dark:bg-slate-900 dark:border-slate-800">
              <Loader2 className="animate-spin" size={20} />
              {t(lang, 'loading')}
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm dark:bg-red-950/60 dark:border-red-900 dark:text-red-200">{error}</div>}

          {ready && view === 'dashboard' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between flex-wrap gap-3 dark:bg-slate-900 dark:border-slate-800">
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">{t(lang, 'globalRisk')}</div>
                  <div className="mt-1">
                    <StatusBadge lang={lang} level={prediction.synthesis.globalRisk} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    {prediction.synthesis.globalRisk === 'high'
                      ? t(lang, 'statusHighDesc')
                      : prediction.synthesis.globalRisk === 'moderate'
                        ? t(lang, 'statusModerateDesc')
                        : t(lang, 'statusNormalDesc')}
                  </p>
                </div>
                <div className="text-xs text-gray-400 dark:text-slate-500">📍 {REGIONS.length} zones • {lang === 'fr' ? region.cropsFr : region.cropsAr}</div>
              </div>
              <TodayCard
                lang={lang}
                regionName={region.name[lang]}
                cropName={crop.name[lang]}
                day={{ ...prediction.days[0], precip: weather.daily.precip[0] }}
                area={safeArea}
                soilSplits={soil.splits}
              />
              <StatCards lang={lang} daily={weather.daily} synthesis={prediction.synthesis} area={safeArea} price={price} />
              <SoilWater lang={lang} dark={dark} daily={weather.daily} prediction={prediction} soilId={soilId} cropId={cropId} />
              <CostsAnalysis lang={lang} synthesis={prediction.synthesis} daily={weather.daily} prediction={prediction} area={safeArea} price={price} />
              <AlertBox lang={lang} alerts={alerts} synthesis={prediction.synthesis} />
              <footer className="text-center text-xs text-gray-400 dark:text-slate-500 pb-6">{t(lang, 'footer')}</footer>
            </>
          )}

          {(view === 'map' || view === 'regions') && (
            <>
              <MoroccoMap lang={lang} selectedId={regionId} onSelect={handleSelect} risks={risks} />
              <RegionSelector
                lang={lang}
                selectedId={regionId}
                onSelect={handleSelect}
                onSave={handleSave}
                saveMsg={saveMsg}
              />
              <FarmSettings
                lang={lang}
                cropId={cropId}
                soilId={soilId}
                area={area}
                price={price}
                onCrop={(id) => { setCropId(id); localStorage.setItem('hydropredict.crop', id); }}
                onSoil={(id) => { setSoilId(id); localStorage.setItem('hydropredict.soil', id); }}
                onArea={(v) => { setArea(Number(v) || 1); localStorage.setItem('hydropredict.area', String(Number(v) || 1)); }}
                onPrice={(v) => { setPrice(Number(v) || 0); localStorage.setItem('hydropredict.price', String(Number(v) || 0)); }}
              />
            </>
          )}

          {view === 'compare' && <RegionCompare lang={lang} dark={dark} cropKc={crop.kc} />}

          {ready && view === 'forecast' && (
            <>
              <div id="forecast">
                <StatusCards lang={lang} current={weather.current} synthesis={prediction.synthesis} />
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <TempChart lang={lang} daily={weather.daily} dark={dark} />
                <SoilChart lang={lang} daily={weather.daily} dark={dark} />
              </div>
              <HourlyTable lang={lang} raw={weather.raw} />
              <FieldDetails lang={lang} daily={weather.daily} prediction={prediction} />
              <WaterChart lang={lang} daily={weather.daily} prediction={prediction} dark={dark} />
              <ClimateNormals lang={lang} dark={dark} regionId={regionId} />
            </>
          )}

          {ready && view === 'plan' && (
            <>
              <IrrigationPlan lang={lang} daily={weather.daily} prediction={prediction} area={safeArea} soilId={soilId} price={price} />
              <SoilWater lang={lang} dark={dark} daily={weather.daily} prediction={prediction} soilId={soilId} cropId={cropId} />
            </>
          )}

          {ready && view === 'agro' && (
            <>
              <CropGuide lang={lang} cropId={cropId} />
              <FertiPheno lang={lang} cropId={cropId} cumulGDD={prediction.synthesis.totalGDD} dayNeed={prediction.days[0].need} soilId={soilId} />
              <PestRisks lang={lang} cropId={cropId} days={prediction.days} />
            </>
          )}

          {view === 'water' && <WaterResources lang={lang} />}

          {view === 'market' && (
            <>
              <MarketPrices lang={lang} dark={dark} />
              {ready && <CostsAnalysis lang={lang} synthesis={prediction.synthesis} daily={weather.daily} prediction={prediction} area={safeArea} price={price} />}
            </>
          )}

          {view === 'farm' && (
            <>
              <ParcelsManager lang={lang} onUse={useParcel} />
              <FarmSettings
                lang={lang}
                cropId={cropId}
                soilId={soilId}
                area={area}
                price={price}
                onCrop={(id) => { setCropId(id); localStorage.setItem('hydropredict.crop', id); }}
                onSoil={(id) => { setSoilId(id); localStorage.setItem('hydropredict.soil', id); }}
                onArea={(v) => { setArea(Number(v) || 1); localStorage.setItem('hydropredict.area', String(Number(v) || 1)); }}
                onPrice={(v) => { setPrice(Number(v) || 0); localStorage.setItem('hydropredict.price', String(Number(v) || 0)); }}
              />
              <TasksJournal lang={lang} />
            </>
          )}

          {ready && view === 'alerts' && (
            <>
              <AlertBox lang={lang} alerts={alerts} synthesis={prediction.synthesis} />
              <PestRisks lang={lang} cropId={cropId} days={prediction.days} />
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="font-bold mb-3">{t(lang, 'forecast')}</h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.days.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs dark:bg-slate-800 dark:border-slate-700">
                      <span className="font-bold tabular-nums">{weather.daily.time[i].slice(5)}</span>
                      <StatusBadge lang={lang} level={d.risk} />
                      <span className="text-gray-500 dark:text-slate-400 tabular-nums">{d.doseMm} mm</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {view === 'history' && <HistoryPanel lang={lang} dark={dark} />}
          </div>
        </main>
      </div>
    </div>
  );
}
