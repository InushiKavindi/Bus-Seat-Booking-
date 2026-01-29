const API_BASE = "http://localhost:5000/api";

const els = {
  from: document.getElementById("fromCity"),
  to: document.getElementById("toCity"),
  search: document.getElementById("searchBtn"),
  status: document.getElementById("status"),
  list: document.getElementById("routesList"),
};

function setStatus(msg, type = "info") {
  els.status.textContent = msg || "";
  els.status.className = `status ${type}`;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadCities() {
  setStatus("Loading cities…");
  try {
    const cities = await fetchJSON(`${API_BASE}/cities`);
    populateSelect(els.from, cities);
    populateSelect(els.to, cities);
    setStatus("Cities loaded. Select from and to.");
  } catch (err) {
    console.warn("/cities failed, falling back to /routes", err);
    try {
      // Fallback: derive unique city IDs/names from routes if /cities not available
      const routes = await fetchJSON(`${API_BASE}/routes`);
      const derived = deriveCitiesFromRoutes(routes);
      populateSelect(els.from, derived);
      populateSelect(els.to, derived);
      setStatus("Cities loaded from routes. Select from and to.");
    } catch (e2) {
      setStatus("Failed to load cities.", "error");
    }
  }
}

function populateSelect(selectEl, cities) {
  // Clear existing options except the first placeholder
  selectEl.length = 1;
  cities.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = String(c.city_id);
    opt.textContent = c.city_name;
    selectEl.appendChild(opt);
  });
}

function deriveCitiesFromRoutes(routes) {
  // If routes contain `from_city`/`to_city` names (legacy), synthesize IDs.
  // If they contain numeric IDs, we cannot derive names; keep them as IDs.
  const map = new Map();
  let nextId = 1;
  routes.forEach((r) => {
    const fromName = r.from_city ?? r.from_city_name;
    const toName = r.to_city ?? r.to_city_name;
    // If numeric IDs present (normalized schema), we can't derive names here.
    // So skip fallback in that case.
    if (typeof fromName === "string" && fromName.trim()) {
      if (!map.has(fromName)) map.set(fromName, { city_id: nextId++, city_name: fromName });
    }
    if (typeof toName === "string" && toName.trim()) {
      if (!map.has(toName)) map.set(toName, { city_id: nextId++, city_name: toName });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.city_name.localeCompare(b.city_name));
}

async function searchRoutes() {
  const from = els.from.value;
  const to = els.to.value;
  if (!from || !to) return;
  setStatus("Searching routes…");
  els.list.innerHTML = "";
  try {
    const routes = await fetchJSON(`${API_BASE}/routes/by-cities?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    renderRoutes(routes);
    setStatus(routes.length ? `Found ${routes.length} route(s).` : "No routes found.");
  } catch (err) {
    console.error("Error fetching routes by cities", err);
    setStatus("Failed to fetch routes.", "error");
  }
}

function renderRoutes(routes) {
  els.list.innerHTML = routes.map((r) => {
    const title = r.route_no ? `Route ${r.route_no}` : `Route #${r.route_id}`;
    const meta = `${r.from_city_name} → ${r.to_city_name}`;
    return `<article class="route-card">
      <h3 class="route-title">${title}</h3>
      <div class="route-meta">${meta}</div>
    </article>`;
  }).join("");
}

function maybeEnableSearch() {
  els.search.disabled = !(els.from.value && els.to.value);
}

// Events
els.from.addEventListener("change", maybeEnableSearch);
els.to.addEventListener("change", maybeEnableSearch);
els.search.addEventListener("click", searchRoutes);

// Init
loadCities();
