<template>
  <div class="dashboard-wrap">
    <div class="wrap">
      <!-- Header -->
      <div class="topbar">
        <div class="header-block">
          <h3 class="mb-1 fw-bold text-white">Dashboard</h3>
          <p class="mb-0 text-white-50 small">Monitor devices, toggle power, and track real-time activity.</p>
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

      <!-- Stats -->
      <div class="row g-3 mb-4 align-items-stretch">
        <div class="col-12 col-md-4">
          <div class="stat-card h-100">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="stat-label">Total Devices</div>
                <div class="stat-value">{{ totalDevices }}</div>
              </div>
              <div class="stat-icon"><i class="fas fa-microchip"></i></div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="stat-card h-100">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="stat-label">Total On</div>
                <div class="stat-value text-success">{{ totalOn }}</div>
              </div>
              <div class="stat-icon on"><i class="fas fa-bolt"></i></div>
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
              <div class="stat-icon off"><i class="fas fa-power-off"></i></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main -->
      <div class="row g-4 align-items-start">
        <!-- Devices -->
        <div class="col-12 col-lg-9">
          <div class="panel-card">
            <div class="panel-head">
              <div>
                <h5 class="mb-0 text-white fw-bold">Devices</h5>
                <p class="mb-0 text-white-50 small">Tap a card to interact quickly</p>
              </div>

              <div class="d-flex gap-2 align-items-center">
                <span class="badge badge-soft">Live</span>
                <span class="badge badge-soft">{{ totalDevices }} total</span>
              </div>
            </div>

            <div class="panel-body">
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
                      <div class="menu-wrap">
                        <button class="btn btn-kebab" type="button" @click.stop="toggleMenu(device.id)">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>

                        <div class="menu-panel" v-if="openMenuId === device.id" @click.stop>
                          <button class="menu-item" type="button" @click="openUpdateModal(device)">
                            <i class="fas fa-pen me-2"></i> Update
                          </button>
                          <button class="menu-item danger" type="button" @click="deleteDevice(device.id)">
                            <i class="fas fa-trash me-2"></i> Delete
                          </button>
                        </div>
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

                      <div class="d-flex justify-content-center">
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
            </div>
          </div>
        </div>

        <!-- Log -->
        <div class="col-12 col-lg-3">
          <div class="panel-card log-panel sticky-log">
            <div class="panel-head">
              <div>
                <h5 class="mb-0 text-white fw-bold">Device Log</h5>
                <p class="mb-0 text-white-50 small">Latest activity (newest first)</p>
              </div>
              <span class="badge badge-soft">Activity</span>
            </div>

            <div class="log-list">
              <div v-if="!logs.length" class="text-white-50 small p-3">No logs yet.</div>

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
      </div><!-- row -->

      <!-- Map -->
      <div class="mt-4">
        <div class="panel-card map-shell">
          <div class="panel-head">
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

    <!-- Backdrop -->
    <div v-if="isAnyModalOpen" class="v-backdrop" @click="closeAllModals"></div>

    <!-- Add Modal -->
    <div v-if="isAddOpen" class="v-modal" role="dialog" aria-modal="true" @click.stop>
      <div class="v-modal-dialog modal-glass" @click.stop>
        <div class="v-modal-head">
          <div>
            <div class="v-modal-title">Add Device</div>
            <div class="v-modal-sub">Fill in the device info</div>
          </div>
          <button class="xbtn" type="button" @click="closeAllModals" aria-label="Close">✕</button>
        </div>

        <div class="v-modal-body">
          <form @submit.prevent="addDevice">
            <div class="grid-1">
              <div class="field">
                <label class="label">Device Name</label>
                <input class="control" v-model="newDevice.name" required />
              </div>

              <div class="field">
                <label class="label">Location</label>
                <input class="control" v-model="newDevice.location" required />
              </div>

              <div class="field">
                <label class="label">Relay Status</label>
                <select class="control" v-model="newDevice.relay_status" required>
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>

              <div class="grid-2">
                <div class="field">
                  <label class="label">Latitude</label>
                  <input class="control" v-model="newDevice.latitude" />
                </div>
                <div class="field">
                  <label class="label">Longitude</label>
                  <input class="control" v-model="newDevice.longitude" />
                </div>
              </div>

              <button type="submit" class="btn btn-add w-100 mt-2">
                <i class="fas fa-plus me-2"></i> Add Device
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div v-if="isEditOpen" class="v-modal" role="dialog" aria-modal="true" @click.stop>
      <div class="v-modal-dialog modal-glass" @click.stop>
        <div class="v-modal-head">
          <div>
            <div class="v-modal-title">Update Device</div>
            <div class="v-modal-sub">Edit device details</div>
          </div>
          <button class="xbtn" type="button" @click="closeAllModals" aria-label="Close">✕</button>
        </div>

        <div class="v-modal-body">
          <form @submit.prevent="updateDevice">
            <div class="grid-1">
              <div class="field">
                <label class="label">Device Name</label>
                <input class="control" v-model="selectedDevice.name" required />
              </div>

              <div class="field">
                <label class="label">Location</label>
                <input class="control" v-model="selectedDevice.location" required />
              </div>

              <div class="grid-2">
                <div class="field">
                  <label class="label">Latitude</label>
                  <input class="control" v-model="selectedDevice.latitude" />
                </div>
                <div class="field">
                  <label class="label">Longitude</label>
                  <input class="control" v-model="selectedDevice.longitude" />
                </div>
              </div>

              <button type="submit" class="btn btn-add w-100 mt-2">
                <i class="fas fa-save me-2"></i> Update Device
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
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
const openMenuId = ref(null);

/* Vue modal state */
const isAddOpen = ref(false);
const isEditOpen = ref(false);
const isAnyModalOpen = computed(() => isAddOpen.value || isEditOpen.value);

const closeAllModals = () => {
  isAddOpen.value = false;
  isEditOpen.value = false;
  openMenuId.value = null;
};

const openAddModal = () => {
  openMenuId.value = null;
  isEditOpen.value = false;
  isAddOpen.value = true;
};

const openUpdateModal = (device) => {
  openMenuId.value = null;
  selectedDevice.value = { ...device }; // includes id
  isAddOpen.value = false;
  isEditOpen.value = true;
};

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const onDocClick = (e) => {
  const within = e.target.closest(".menu-wrap");
  if (!within) openMenuId.value = null;
};

/* CRUD */
const newDevice = ref({
  name: "",
  location: "",
  status: "Active",
  relay_status: "OFF",
  active: true,
  latitude: "",
  longitude: "",
});

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
    closeAllModals();
  } catch (error) {
    console.error("Error adding new device:", error);
  }
};

const updateDevice = async () => {
  try {
    if (!selectedDevice.value?.id) return;

    await update(dbRef(db, `bulbs/${selectedDevice.value.id}`), {
      name: selectedDevice.value.name,
      location: selectedDevice.value.location,
      latitude: selectedDevice.value.latitude || "",
      longitude: selectedDevice.value.longitude || "",
    });

    closeAllModals();
  } catch (error) {
    console.error("Error updating device:", error);
  }
};

const deleteDevice = async (deviceId) => {
  if (!confirm("Are you sure you want to delete this device?")) return;
  try {
    await remove(dbRef(db, `bulbs/${deviceId}`));
  } catch (error) {
    console.error("Error deleting device:", error);
  }
};

const toggleStatus = (device) => {
  const updatedStatus = device.relay_status === "ON" ? "OFF" : "ON";
  update(dbRef(db, `bulbs/${device.id}`), { relay_status: updatedStatus });
};

/* Computed counts */
const totalDevices = computed(() => bulbs.value.length);
const totalOn = computed(() => bulbs.value.filter((d) => d.ac_voltage > 190).length);
const totalOff = computed(() => bulbs.value.filter((d) => d.ac_voltage < 190).length);

/* Map */
const map = ref(null);
const markersLayer = ref(null);

const initializeMap = () => {
  const munozCoordinates = [15.7301769, 120.9298825];
  map.value = L.map("map").setView(munozCoordinates, 14);

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
    }
  });
};

/* Interactions */
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
  el.style.transform = `translate(${x * 0.1}px, ${y * 0.14}px)`;
};
const magnetLeave = (e) => {
  e.currentTarget.style.transform = "translate(0px, 0px)";
};

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("click", onDocClick, true);

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
        const corrected = logsData[id].replace(/'/g, '"');
        logs.value.push({ id, ...JSON.parse(corrected) });
      } catch {}
    }
    logs.value.sort((a, b) => new Date(b.time) - new Date(a.time));
  });
});

onUnmounted(() => {
  document.removeEventListener("click", onDocClick, true);
  if (map.value) map.value.remove();
});
</script>

<style scoped>
/* ✅ Wider dashboard control */
.wrap {
  --wrap-max: 1440px; /* change to 1600px or 100% for ultra-wide */
  max-width: var(--wrap-max);
  margin: 0 auto;
  padding: 18px 22px;
}

/* Background */
.dashboard-wrap {
  min-height: 100vh;
 
  background: radial-gradient(900px 500px at 10% 10%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(168, 85, 247, 0.18), transparent 60%),
    radial-gradient(900px 500px at 30% 90%, rgba(34, 211, 238, 0.10), transparent 55%);
}

/* ✅ Top layout alignment */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
@media (max-width: 576px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }
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
  white-space: nowrap;
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
  overflow: visible;
}
.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
}
.panel-body {
  padding: 14px 16px 16px;
}

/* Stat cards */
.stat-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.18);
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
  transition: 260ms ease;
  min-height: 300px;
  overflow: visible !important;
}

/* Kebab + menu */
.btn-kebab {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: rgba(255, 255, 255, 0.85);
}
.menu-wrap {
  position: relative;
  z-index: 2000;
}
.menu-panel {
  position: absolute;
  top: 44px;
  right: 0;
  width: 168px;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
  z-index: 9999;
}
.menu-item {
  width: 100%;
  text-align: left;
  border: 0;
  padding: 10px 12px;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}
.menu-item.danger {
  color: #ffb4b4;
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
  max-height: 560px;
}
.log-list {
  max-height: 470px;
  overflow: auto;
}
.log-item {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
@media (min-width: 992px) {
  .sticky-log {
    position: sticky;
    top: 86px;
  }
}

/* Map */
.map {
  height: 58vh;
  width: 100%;
  border-radius: 18px;
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
  border-radius: 18px;
  background: radial-gradient(240px circle at var(--x) var(--y), rgba(168, 85, 247, 0.18), transparent 55%);
  opacity: 0;
  transition: 240ms ease;
  pointer-events: none;
}
.spotlight:hover::after {
  opacity: 1;
}

/* ✅ Modal */
.v-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: 999;
}
.v-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 18px;
}
.v-modal-dialog {
  width: min(720px, 96vw); /* ✅ wider modal */
  border-radius: 18px;
  overflow: hidden;
  animation: popIn 180ms ease;
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-glass {
  background: rgba(15, 23, 42, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
}

/* ✅ Modal header aligned */
.v-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
}
.v-modal-title {
  color: white;
  font-weight: 900;
  font-size: 22px;
  line-height: 1.1;
}
.v-modal-sub {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  margin-top: 4px;
}
.xbtn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  display: grid;
  place-items: center;
}
.xbtn:hover {
  background: rgba(255, 255, 255, 0.10);
}

.v-modal-body {
  padding: 14px 18px 18px;
}

/* ✅ Modal form layout */
.grid-1 {
  display: grid;
  gap: 12px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 576px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

.field .label {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  margin-bottom: 6px;
}
.control {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  outline: none;
}
.control:focus {
  border-color: rgba(168, 85, 247, 0.55);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.18);
}
</style>
