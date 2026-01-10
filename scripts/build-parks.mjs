import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "data", "parks_raw");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "parks.json");

function toId(filename) {
  return filename.replace(/\.json$/i, "").toLowerCase();
}

function normalizePark(p, fallbackId) {
  const lat = Number(p.lat ?? p.latitude ?? p.Location?.lat ?? p.Location?.latitude);
  const lng = Number(p.lng ?? p.lon ?? p.longitude ?? p.Location?.lng ?? p.Location?.longitude);

  return {
    id: String(p.id ?? fallbackId),
    name: String(p.name ?? p.park_name ?? p.fullName ?? p.title ?? fallbackId),
    state: p.state ?? p.states ?? p.address?.state ?? null,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    // keep anything else if you want:
    ...p,
  };
}

if (!fs.existsSync(RAW_DIR)) {
  console.error("Missing folder:", RAW_DIR);
  process.exit(1);
}

const files = fs.readdirSync(RAW_DIR).filter(f => f.toLowerCase().endsWith(".json"));
if (files.length === 0) {
  console.error("No .json files found in:", RAW_DIR);
  process.exit(1);
}

const parks = [];
for (const file of files) {
  const full = path.join(RAW_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    console.error("Bad JSON:", file);
    throw e;
  }

  const id = toId(file);
  const park = normalizePark(obj, id);

  if (!park.lat || !park.lng) {
    console.warn("⚠️ Missing lat/lng:", file, "=>", { lat: park.lat, lng: park.lng });
  }

  parks.push(park);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(parks, null, 2), "utf8");

console.log(`✅ Built ${parks.length} parks -> ${path.relative(ROOT, OUT_FILE)}`);
