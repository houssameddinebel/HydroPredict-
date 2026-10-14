// Optional persistence via PHP/MySQL backend.
// Falls back to localStorage when backend is unreachable (e.g. `npm run dev` without PHP).

const BACKEND_BASE = ''; // same origin; use '/backend' with vite proxy or deploy backend/ alongside dist/

export async function saveZonePreference({ userId = 1, regionId, crop = null, areaHa = null }) {
  // Always keep a local copy.
  try {
    localStorage.setItem('hydropredict.region', regionId);
  } catch { /* ignore */ }

  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/save_zone.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, region_id: regionId, crop, area_ha: areaHa })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true, ...(await res.json()) };
  } catch (e) {
    return { ok: false, offline: true, error: String(e) };
  }
}

export async function saveForecastLog({ regionId, forecastJson, risk }) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/save_forecast.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region_id: regionId, forecast: forecastJson, risk })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function fetchLogs(limit = 20) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/get_logs.php?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e), data: [] };
  }
}

export async function fetchParcels(userId = 1) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/get_parcels.php?user_id=${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e), data: [] };
  }
}

export async function createParcel(payload) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/get_parcels.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function fetchTasks(userId = 1) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/get_tasks.php?user_id=${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e), data: [] };
  }
}

export async function createTask(payload) {
  try {
    const res = await fetch(`${BACKEND_BASE}/backend/api/get_tasks.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
