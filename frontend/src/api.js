const API_BASE = "http://localhost:5000/api";

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getCities() {
  // Always fetch from cities table via API
  return fetchJSON(`${API_BASE}/cities`);
}

export async function getRoutesByCities(fromId, toId) {
  return fetchJSON(`${API_BASE}/routes/by-cities?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`);
}
