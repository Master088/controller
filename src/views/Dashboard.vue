<template>
  <div class="dashboard-wrap">
    <!-- Centered container for perfect alignment -->
    <div class="page-container">
      <!-- Top Header -->
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div class="header-block">
          <h3 class="mb-1 fw-bold text-white">Dashboard UPDATED</h3>
          <p class="mb-0 text-white-50 small">
            Monitor devices, toggle power, and track real-time activity.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-add magnetic"
          @click="openAddModal"
          @mousemove="magnetMove"
          @mouseleave="magnetLeave"
        >
          <i class="fas fa-plus me-2"></i> Add Device
        </button>
      </div>

      <!-- Stats Row -->
      <div class="row g-3 mb-4 align-items-stretch">
        <div class="col-12 col-md-4">
          <div class="stat-card h-100">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="stat-label">Total Devices</div>
                <div class="stat-value">{{ totalDevices }}</div>
              </div>
              <div class="stat-icon">
                <i class="fas fa-microchip"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="stat-card h-100">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="stat-label">Total On TEST</div>
                <div class="stat-value text-success">{{ totalOn }}</div>
              </div>
              <div class="stat-icon on">
                <i class="fas fa-bolt"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="stat-card h-100">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="stat-label">Total Off</div>
                <div class="stat-value text-danger">{{ totalOff }}</div>
              </div>
              <div class="stat-icon off">
                <i class="fas fa-power-off"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row g-4 align-items-start">
        <!-- Devices -->
        <div class="col-12 col-lg-9">
          <div class="panel-card">
            <div class="panel-head d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <h5 class="mb-0 text-white fw-bold">Devices</h5>
                <p class="mb-0 text-white-50 small">Tap a card to interact quickly</p>
              </div>

              <div class="d-flex gap-2 align-items-center">
                <span class="badge badge-soft">Live</span>
                <span class="badge badge-soft">{{ totalDevices }} total</span>
              </div>
            </div>

            <div class="p-3 pt-2">
              <div class="row g-3">
                <div class="col-12 col-sm-6 col-md-4 col-xl-3" v-for="device in bulbs" :key="device.id">
                  <div
                    class="device-card spotlight tilt h-100"
                    @mousemove="tiltMove"
                    @mouseleave="tiltLeave"
                    @mouseenter="tiltEnter"
                    @mousemove.capture="spotlightMove"
                    @mouseleave.capture="spotlightLeave"
                  >
                    <!-- Kebab -->
                    <div class="position-absolute top-0 end-0 p-2">
                      <div class="dropdown">
                        <button class="btn btn-kebab" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>

                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                          <li>
                            <!-- IMPORTANT: programmatic modal open -->
                            <button type="button" class="dropdown-item" @click="openUpdateModal(device)">
                              <i class="fas fa-pen me-2"></i> Update
                            </button>
                          </li>
                          <li>
                            <button class="dropdown-item text-danger" type="button" @click="deleteDevice(device.id)">
                              <i class="fas fa-trash me-2"></i> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="card-body text-center d-flex flex-column">
                      <div class="bulb-wrap mb-3">
                        <i class="fas fa-lightbulb bulb" :class="device.ac_voltage > 190 ? 'is-on' : 'is-off'"></i>
                        <div class="bulb-glow" :class="device.ac_voltage > 190 ? 'glow-on' : 'glow-off'"></div>
                      </div>

                      <div class="small text-white-50">ID: {{ device.id }}</div>
                      <div class="h5 mb-1 fw-bold text-white">{{ device.name }}</div>
                      <div class="text-white-50 small mb-2">📍 {{ device.location }}</div>

                      <div class="status-line mb-2">
                        <span class="text-white-50">Status:</span>
                        <span class="ms-2 fw-bold" :class="device.ac_voltage > 190 ? 'text-success' : 'text-danger'">
                          {{ device.ac_voltage > 190 ? "ON" : "OFF" }}
                        </span>
                      </div>

                      <div class="d-flex justify-content-center mt-1">
                        <div class="form-check form-switch text-start">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="device.ac_voltage > 190"
                            @change="toggleStatus(device)"
                          />
                          <label class="form-check-label text-white-50 small">
                            {{ device?.ac_voltage < 190 ? "Turn On" : "Turn Off" }}
                          </label>
                        </div>
                      </div>

                      <div class="mt-auto device-foot pt-3">
                        <span class="pill" :class="device.ac_voltage > 190 ? 'pill-on' : 'pill-off'">
                          {{ device.ac_voltage > 190 ? "Powered" : "Standby" }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div><!-- row -->
            </div><!-- pad -->
          </div>
        </div>

        <!-- Log -->
        <div class="col-12 col-lg-3">
          <div class="panel-card log-panel sticky-log">
            <div class="panel-head">
              <h5 class="mb-0 text-white fw-bold">Device Log</h5>
              <p class="mb-0 text-white-50 small">Latest activity (newest first)</p>
            </div>

            <div class="log-list">
              <div v-if="!logs.length" class="text-white-50 small p-3">
                No logs yet.
              </div>

              <div v-for="log in logs" :key="log.id" class="log-item">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <div class="log-title text-white fw-semibold">{{ log.device_name }}</div>
                    <div class="log-sub text-white-50 small">{{ log.time }}</div>
                  </div>
                  <span class="log-badge" :class="log.status === 'ON' ? 'badge-on' : 'badge-off'">
                    {{ log.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Log -->
      </div>

      <!-- Map -->
      <div class="mt-4">
        <div class="panel-card map-shell">
          <div class="panel-head d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0 text-white fw-bold">Map</h5>
              <p class="mb-0 text-white-50 small">Device locations + status markers</p>
            </div>
            <span class="badge badge-soft">OpenStreetMap</span>
          </div>
          <div id="map" class="map"></div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addDeviceModal" ref="addModalEl" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-glass">
          <div class="modal-header border-0">
            <div>
              <h5 class="modal-title text-white fw-bold">Add New Device</h5>
              <p class="mb-0 text-white-50 small">Fill in the device info</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body pt-0">
            <form @submit.prevent="addDevice">
              <div class="mb-3">
                <label class="form-label text-white-50 small">Device Name</label>
                <input class="form-control form-dark" v-model="newDevice.name" required />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small">Location</label>
                <input class="form-control form-dark" v-model="newDevice.location" required />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small">Relay Status</label>
                <select class="form-select form-dark" v-model="newDevice.relay_status" required>
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label text-white-50 small">Latitude</label>
                  <input class="form-control form-dark" v-model="newDevice.latitude" />
                </div>
                <div class="col-6">
                  <label class="form-label text-white-50 small">Longitude</label>
                  <input class="form-control form-dark" v-model="newDevice.longitude" />
                </div>
              </div>

              <button type="submit" class="btn btn-add w-100 mt-4">
                <i class="fas fa-plus me-2"></i> Add Device
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div class="modal fade" id="update_device" ref="updateModalEl" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-glass">
          <div class="modal-header border-0">
            <div>
              <h5 class="modal-title text-white fw-bold">Update Device</h5>
              <p class="mb-0 text-white-50 small">Edit device details</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body pt-0">
            <form @submit.prevent="updateDevice">
              <div class="mb-3">
                <label class="form-label text-white-50 small">Device Name</label>
                <input class="form-control form-dark" v-model="selectedDevice.name" required />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small">Location</label>
                <input class="form-control form-dark" v-model="selectedDevice.location" required />
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label text-white-50 small">Latitude</label>
                  <input class="form-control form-dark" v-model="selectedDevice.latitude" />
                </div>
                <div class="col-6">
                  <label class="form-label text-white-50 small">Longitude</label>
                  <input class="form-control form-dark" v-model="selectedDevice.longitude" />
                </div>
              </div>

              <button type="submit" class="btn btn-add w-100 mt-4">
                <i class="fas fa-save me-2"></i> Update Device
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from "vue";
import { db } from "../firebase";
import { push, ref as dbRef, onValue, update, remove } from "firebase/database";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const bulbs = ref([]);
const logs = ref([]);
const bulbsRef = dbRef(db, "bulbs");
const logsRef = dbRef(db, "logs");

const selectedDevice = ref({});
const newDevice = ref({
  name: "",
  location: "",
  status: "Active",
  relay_status: "OFF",
  active: true,
  latitude: "",
  longitude: "",
});

const map = ref(null);
const markersLayer = ref(null);

// Modal refs
const addModalEl = ref(null);
const updateModalEl = ref(null);

/** ✅ Bootstrap Modal getter (works for CDN or bundle) */
const getBsModal = () => {
  // If you are using bootstrap bundle globally (CDN/bundle)
  if (window?.bootstrap?.Modal) return window.bootstrap.Modal;

  // If not global, try dynamic import fallback (won’t crash app if missing)
  return null;
};

const hideOpenDropdowns = () => {
  // close any open dropdown menus to avoid focus conflicts
  document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
    menu.classList.remove("show");
  });
};

const showModal = async (el) => {
  await nextTick();

  const ModalCtor = getBsModal();
  if (!ModalCtor) {
    console.error("Bootstrap Modal not found. Make sure bootstrap.bundle.min.js is loaded.");
    return;
  }

  if (!el) return;
  const modal = ModalCtor.getOrCreateInstance(el, { backdrop: "static", keyboard: true });
  modal.show();
};

const hideModal = (el) => {
  const ModalCtor = getBsModal();
  if (!ModalCtor || !el) return;
  ModalCtor.getInstance(el)?.hide();
};

const openAddModal = async () => {
  hideOpenDropdowns();
  await showModal(addModalEl.value || document.getElementById("addDeviceModal"));
};

const openUpdateModal = async (device) => {
  hideOpenDropdowns();
  selectedDevice.value = { ...device }; // ✅ includes id
  await showModal(updateModalEl.value || document.getElementById("update_device"));
};

// CRUD
const addDevice = async () => {
  try {
    await push(bulbsRef, { ...newDevice.value });

    Object.assign(newDevice.value, {
      name: "",
      location: "",
      status: "Active",
      relay_status: "OFF",
      active: true,
      latitude: "",
      longitude: "",
    });

    hideModal(addModalEl.value || document.getElementById("addDeviceModal"));
  } catch (e) {
    console.error("Error adding device:", e);
  }
};

const updateDevice = async () => {
  try {
    if (!selectedDevice.value?.id) {
      console.error("Missing device id. selectedDevice:", selectedDevice.value);
      return;
    }

    await update(dbRef(db, `bulbs/${selectedDevice.value.id}`), {
      name: selectedDevice.value.name,
      location: selectedDevice.value.location,
      latitude: selectedDevice.value.latitude || "",
      longitude: selectedDevice.value.longitude || "",
    });

    hideModal(updateModalEl.value || document.getElementById("update_device"));
  } catch (e) {
    console.error("Error updating device:", e);
  }
};

const deleteDevice = async (deviceId) => {
  if (!confirm("Are you sure you want to delete this device?")) return;
  try {
    await remove(dbRef(db, `bulbs/${deviceId}`));
  } catch (e) {
    console.error("Error deleting device:", e);
  }
};

const toggleStatus = (device) => {
  const updatedStatus = device.relay_status === "ON" ? "OFF" : "ON";
  update(dbRef(db, `bulbs/${device.id}`), { relay_status: updatedStatus });
};

// Computed
const totalDevices = computed(() => bulbs.value.length);
const totalOn = computed(() => bulbs.value.filter((d) => d.ac_voltage > 190).length);
const totalOff = computed(() => bulbs.value.filter((d) => d.ac_voltage < 190).length);

// Map
const initializeMap = () => {
  const muñozCoordinates = [15.7301769, 120.9298825];
  map.value = L.map("map").setView(muñozCoordinates, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);

  markersLayer.value = L.layerGroup().addTo(map.value);
};

const updateMapMarkers = (data) => {
  if (!markersLayer.value) return;
  markersLayer.value.clearLayers();

  data.forEach((bulb) => {
    if (bulb.latitude && bulb.longitude) {
      const isOn = bulb.ac_voltage > 190;
      const markerColor = isOn ? "green" : "red";

      const pinIcon = L.divIcon({
        className: "fa-2x",
        html: `<i class="fas fa-map-marker-alt" style="color:${markerColor};"></i>`,
        iconSize: [50, 50],
        iconAnchor: [15, 30],
      });

      L.marker([bulb.latitude, bulb.longitude], { icon: pinIcon }).addTo(markersLayer.value);

      const labelIcon = L.divIcon({
        className: "text-label",
        html: `<div style="
          display:inline-block;
          background: rgba(0,123,255,0.8);
          color:white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 10px;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.25);
        ">
          ${bulb.name || "Bulb"} (${isOn ? "ON" : "OFF"})
        </div>`,
        iconAnchor: [-1, -3],
        interactive: false,
      });

      L.marker([bulb.latitude, bulb.longitude], { icon: labelIcon }).addTo(markersLayer.value);
    }
  });
};

// Motion micro interactions (kept)
const prefersReducedMotion = ref(false);

const tiltEnter = (e) => {
  if (prefersReducedMotion.value) return;
  e.currentTarget.style.transition = "transform 120ms ease";
};
const tiltMove = (e) => {
  if (prefersReducedMotion.value) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;

  const rotY = (px - 0.5) * 10;
  const rotX = -(py - 0.5) * 10;

  el.style.transition = "transform 0ms";
  el.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
};
const tiltLeave = (e) => {
  const el = e.currentTarget;
  el.style.transition = "transform 320ms cubic-bezier(.2,.8,.2,1)";
  el.style.transform = "translateY(0px) rotateX(0deg) rotateY(0deg)";
};

const spotlightMove = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
};
const spotlightLeave = (e) => {
  const el = e.currentTarget;
  el.style.setProperty("--x", `-200px`);
  el.style.setProperty("--y", `-200px`);
};

const magnetMove = (e) => {
  if (prefersReducedMotion.value) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - (r.left + r.width / 2);
  const y = e.clientY - (r.top + r.height / 2);
  el.style.transform = `translate(${x * 0.10}px, ${y * 0.14}px)`;
};
const magnetLeave = (e) => {
  e.currentTarget.style.transform = "translate(0px, 0px)";
};

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initializeMap();

  onValue(bulbsRef, (snapshot) => {
    bulbs.value = [];
    const bulbsData = snapshot.val() || {};
    for (let id in bulbsData) bulbs.value.push({ id, ...bulbsData[id] });
    updateMapMarkers(bulbs.value);
  });

  onValue(logsRef, (snapshot) => {
    logs.value = [];
    const logsData = snapshot.val() || {};

    for (let id in logsData) {
      try {
        const correctedData = logsData[id].replace(/'/g, '"');
        const parsedLog = JSON.parse(correctedData);
        logs.value.push({ id, ...parsedLog });
      } catch (error) {
        // ignore malformed
      }
    }

    logs.value.sort((a, b) => new Date(b.time) - new Date(a.time));
  });
});

onUnmounted(() => {
  if (map.value) map.value.remove();
});
</script>

<style scoped>
/* ✅ alignment container */
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 18px 28px;
}

.dashboard-wrap {
  min-height: 100vh;
  padding-bottom: 28px;
  background: radial-gradient(900px 500px at 10% 10%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(168, 85, 247, 0.18), transparent 60%),
    radial-gradient(900px 500px at 30% 90%, rgba(34, 211, 238, 0.10), transparent 55%);
}

/* Header */
.header-block {
  padding: 10px 12px;
  border-radius: 16px;
}

/* Buttons */
.btn-add {
  background: linear-gradient(135deg, #6d28d9, #4f46e5);
  color: #fff;
  border: 0;
  padding: 10px 16px;
  border-radius: 14px;
  font-weight: 800;
  box-shadow: 0 18px 45px rgba(109, 40, 217, 0.22);
  transition: 220ms ease;
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 60px rgba(109, 40, 217, 0.28);
}
.magnetic {
  transition: transform 140ms ease;
  will-change: transform;
}

/* Panels */
.panel-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}
.panel-head {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
}

/* Stats */
.stat-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.18);
  transition: 240ms ease;
}
.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(168, 85, 247, 0.35);
}
.stat-label {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}
.stat-value {
  color: white;
  font-weight: 900;
  font-size: 28px;
  line-height: 1.1;
}
.stat-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}
.stat-icon.on {
  background: rgba(34, 197, 94, 0.14);
  border-color: rgba(34, 197, 94, 0.25);
}
.stat-icon.off {
  background: rgba(239, 68, 68, 0.14);
  border-color: rgba(239, 68, 68, 0.25);
}

/* Badges */
.badge-soft {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 700;
}

/* Device cards */
.device-card {
  position: relative;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.20);
  overflow: hidden;
  transition: 260ms ease;
  min-height: 300px; /* ✅ equal height feel */
}
.device-card:hover {
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 26px 85px rgba(0, 0, 0, 0.26);
}

/* Kebab */
.btn-kebab {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: rgba(255, 255, 255, 0.85);
}
.btn-kebab:hover {
  background: rgba(255, 255, 255, 0.10);
}

/* Bulb */
.bulb-wrap {
  position: relative;
  height: 86px;
  display: grid;
  place-items: center;
}
.bulb {
  font-size: 64px;
  position: relative;
  z-index: 2;
}
.bulb-glow {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.75;
  z-index: 1;
  transition: 240ms ease;
}
.is-on {
  color: #facc15;
  animation: bulbPulse 1.8s ease-in-out infinite;
}
.glow-on {
  background: rgba(250, 204, 21, 0.35);
}
.is-off {
  color: rgba(255, 255, 255, 0.25);
}
.glow-off {
  background: rgba(255, 255, 255, 0.04);
  opacity: 0.4;
}
@keyframes bulbPulse {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 0 0 rgba(250, 204, 21, 0));
  }
  50% {
    transform: translateY(-2px) scale(1.02);
    filter: drop-shadow(0 0 14px rgba(250, 204, 21, 0.55));
  }
}

/* Pills */
.device-foot {
  display: flex;
  justify-content: center;
}
.pill {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  font-weight: 700;
}
.pill-on {
  border-color: rgba(34, 197, 94, 0.30);
  background: rgba(34, 197, 94, 0.12);
}
.pill-off {
  border-color: rgba(239, 68, 68, 0.30);
  background: rgba(239, 68, 68, 0.12);
}

/* Log */
.log-panel {
  max-height: 520px;
}
.log-list {
  max-height: 460px;
  overflow: auto;
}
.log-item {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: 200ms ease;
}
.log-item:hover {
  background: rgba(255, 255, 255, 0.04);
}
.log-title {
  font-size: 14px;
}
.log-sub {
  font-size: 12px;
}
.log-badge {
  font-size: 12px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.badge-on {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.30);
  color: #86efac;
}
.badge-off {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.30);
  color: #fca5a5;
}

/* ✅ Sticky log only on desktop for alignment */
@media (min-width: 992px) {
  .sticky-log {
    position: sticky;
    top: 86px; /* below navbar */
  }
}

/* Map */
.map {
  height: 58vh;
  width: 100%;
  border-radius: 18px;
}

/* Modals */
.modal-glass {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  border-radius: 18px;
}
.form-dark {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #fff !important;
}
.form-dark::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

/* Spotlight + Tilt */
.spotlight {
  --x: -200px;
  --y: -200px;
}
.spotlight::after {
  content: "";
  position: absolute;
  inset: -1px;
  background: radial-gradient(240px circle at var(--x) var(--y), rgba(168, 85, 247, 0.18), transparent 55%);
  opacity: 0;
  transition: 240ms ease;
  pointer-events: none;
}
.spotlight:hover::after {
  opacity: 1;
}
.tilt {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>
