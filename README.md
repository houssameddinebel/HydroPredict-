# HydroPredict Souss-Massa — hydro-predict.ma

Bilingual (FR/AR, LTR/RTL) smart-irrigation dashboard for farmers in Souss-Massa, Morocco.
Frontend: React + Tailwind + Lucide + Chart.js. Weather: Open-Meteo (no key). Backend: PHP PDO + MySQL.

## Structure

```
src/
  App.jsx                 Main dashboard (sidebar + header + charts)
  main.jsx
  index.css
  data/regions.js         5 zones with lat/lon
  i18n/translations.js    FR/AR dictionary
  services/weatherApi.js  Open-Meteo fetch (current + 7-day daily + hourly soil/humidity)
  services/predictionEngine.js  AI heuristic: water-need %, ETc doses, GDD, frost/wind/fungal flags
  services/backendApi.js  PHP persistence (graceful offline fallback)
  components/             Sidebar, Header, RegionSelector, FarmSettings, StatusCards,
                          StatCards, TodayCard, FieldDetails, IrrigationPlan, AlertBox,
                          HistoryPanel, Charts, Logo
  pages/Landing.jsx       Public marketing site (hero, features, coverage, pricing, FAQ)
backend/
  database.sql            regions, users, user_logs, forecast_logs
  config/db.php           PDO + JSON helpers
  api/save_zone.php       POST {user_id, region_id}
  api/save_forecast.php   POST {region_id, forecast, risk}
  api/get_logs.php        GET ?limit&region_id
  api/get_regions.php     GET regions
```

## Frontend run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

Vite proxies `/backend/*` → `http://localhost:8000` (see `vite.config.js`).
In production, serve `backend/` from the same host (e.g. Apache) so `/backend/api/*.php` resolves,
or set `BACKEND_BASE` in `src/services/backendApi.js`.

## Backend run (Windows — already set up on this machine)

PHP 8.3 installed via `winget install --id PHP.PHP.8.3`, with these
extensions enabled in `php.ini`: `curl, mbstring, mysqli, openssl, pdo_mysql`.
MySQL 8 (`MySQL80` service) running. Credentials live in `backend/.env`:



Import (use `cmd` redirection — a PowerShell pipe mangles UTF-8/Arabic):

```bat
mysql -u root -p12345 --default-character-set=utf8mb4 < backend\database.sql
```

Serve (DB_* env vars must be set in the server's environment):

```powershell
$env:DB_HOST='127.0.0.1'; $env:DB_NAME='hydropredict'
$env:DB_USER='root'; $env:DB_PASS='12345'
php -S 127.0.0.1:8000 -t backend/
```

A PHP dev server is currently running at http://127.0.0.1:8000.
Test (use `--data-binary "@file.json"` — inline `-d '{...}'` gets
mangled by PowerShell when calling native `curl.exe`):

```bash
curl http://localhost:8000/api/get_regions.php
curl -X POST http://localhost:8000/api/save_zone.php -H "Content-Type: application/json" --data-binary "@body.json"
```

## Theme

Dark theme by default (`class` strategy in `tailwind.config.js`, toggle in the
header, persisted as `hydropredict.theme`). Charts adapt grid/tick/legend
colors via `chartColors(dark)` in `src/components/Charts.jsx`.

> Gotcha fixed: `save_zone.php` used the same named placeholder twice
> (`:r` in `INSERT ... ON DUPLICATE KEY UPDATE`) which fails with
> `SQLSTATE[HY093]` under native prepares — now uses `:r` / `:r2`.
```

Apache: point DocumentRoot so that `/backend/api/*.php` works, frontend `dist/` served at `/`.

## Open-Meteo example

```
https://api.open-meteo.com/v1/forecast?latitude=30.42&longitude=-9.59&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,wind_speed_10m_max&timezone=Africa/Casablanca&forecast_days=7
```

## AI model (predictionEngine.js)

Per day: `need = 20 + (tavg-20)*4 + ET0*8 − rain*12` clamped 5–100.
- rain ≥ 5mm → skip irrigation, risk normal
- need ≥ 80 or (Tmax ≥ 34 & rain < 1) → critical, risk high
- need ≥ 60 or (Tmax ≥ 30 & ET0 > 5.5) → reinforced, high/moderate
- need ≥ 40 → normal, else light
Global 7-day risk from high-day count, avg temp, total rain. Color coding: green / orange / red.

Extended farmer layer (`data/crops.js` + engine v2):
- 12 crops with Kc → `ETc = ET0 × Kc`, net dose `ETc − 80% rain` (mm), volume `mm × 10 × ha` (m³)
- 3 soils (sandy splits ×2, loam ×1, clay every 2 days) + irrigation window (dawn, after 9h on frost)
- GDD base 10, frost (Tmin ≤ 2 °C), heatwave (≥ 38 °C), wind ≥ 40 km/h, fungal risk (RH ≥ 80% + 12–26 °C)
- Open-Meteo hourly aggregates: humidity max, soil T°/moisture, rain probability, sunshine
- Week totals + savings vs naive 6 mm/day schedule; `users` stores `preferred_crop`, `field_area_ha`
