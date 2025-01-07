<template>
  <div class="mt-5">
    <div class="container-fluid">
      <div class="d-flex justify-content-between mb-5">
        <h3>Dashboard</h3>
        <button
          type="button"
          class="btn px-4"
          style="background-color: #1a2d4a; color: white"
          data-bs-toggle="modal"
          data-bs-target="#addDeviceModal"
        >
          Add Device
        </button>
      </div>
    </div>
    <div class="container-fluid">
      <div class="gap-3">
        <div class="row mb-4">
          <div class="col">
            <div class="card shadow-sm border-start border-5 border-0">
              <div class="card-body">
                <h5 class="fw-normal">Total Devices</h5>
                <p class="card-text">{{ totalDevices }}</p>
              </div>
            </div>
          </div>
          <!-- <div class="col">
            <div class="card shadow-sm border-start border-5 border-0">
              <div class="card-body">
                <h5 class="fw-normal">Total Active</h5>
                <p class="card-text">{{ totalActive }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm border-start border-5 border-0">
              <div class="card-body">
                <h5 class="fw-normal">Total Inactive</h5>
                <p class="card-text">{{ totalInactive }}</p>
              </div>
            </div>
          </div> -->
          <div class="col">
            <div class="card shadow-sm border-start border-5 border-0">
              <div class="card-body">
                <h5 class="fw-normal">Total On</h5>
                <p class="card-text">{{ totalOn }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm border-start border-5 border-0">
              <div class="card-body">
                <h5 class="fw-normal">Total Off</h5>
                <p class="card-text">{{ totalOff }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-9">
          <div class="row mb-4">
            <div>
              <!-- Device Cards -->
              <div class="row">
                <div
                  class="col-md-3 mb-4"
                  v-for="device in bulbs"
                  :key="device.id"
                >
                  <div class="card border-0 card-device">
                    <div class="card-body position-relative">
                      <div class="text-center mb-3">
                        <i
                          class="fas fa-lightbulb"
                          :style="{
                            color:
                              device.ac_voltage >190 ? 'yellow' : 'gray',
                            fontSize: '60px',
                          }"
                        ></i>
                      </div>
                      <div class="text-center">
                        <span class="card-title">{{ device.id}}</span>
                        <h5 class="card-title">{{ device.name }}</h5>
                        <p class="card-text">Location: {{ device.location }}</p>
                        <!-- <p class="card-text">
                          Is Active?:
                          <span
                            :class="
                              device.active === true
                                ? 'text-success'
                                : 'text-danger'
                            "
                          >
                            {{ device.active }}
                          </span>
                        </p> -->
                        <p class="card-text">
                          Status:
                          <span
                            :class="
                              device.ac_voltage > 190
                                ? 'text-success'
                                : 'text-danger'
                            "
                          >
                            {{ device.ac_voltage > 190? "ON":"OFF" }}
                          </span>
                        </p>
                        
                        <div class="form-check form-switch">
                          <input
                            type="checkbox"
                            class="form-check-input"
                           
                            :checked="device.ac_voltage > 190"
                            @change="toggleStatus(device)"
                          />
                          <label class="form-check-label">
                            {{
                              device?.ac_voltage < 190 
                                ? "Turn Off" 
                                : "Turn On" 
                            }}
                          </label>
                        </div>
                      </div>

                      <!-- Kebab Menu -->
                      <div class="position-absolute top-0 end-0">
                        <div class="dropdown">
                          <button
                            class="btn btn-sm btn-white p-3"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            data-bs-target="#dropdownMenuButton"
                          >
                            <i class="fas fa-ellipsis-v"></i>
                          </button>
                          <ul
                            class="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li>
                              <button
                                type="button"
                                class="btn w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#update_device"
                                @click="openUpdateModal(device)"
                              >
                                Update
                              </button>
                            </li>
                            <li>
                              <a
                                class="dropdown-item text-danger d-flex justify-content-center"
                                href="#"
                                @click="deleteDevice(device.id)"
                              >
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <!-- Log -->
          <div class="col" style="max-height: 500px; overflow-y: auto">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Device Log</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="log in logs" :key="log.id">
                    <strong>{{ log.device_name }}</strong> - {{ log.time }} -
                    <span
                      :class="
                        log.status === 'ON' ? 'text-success' : 'text-danger'
                      "
                    >
                      {{ log.status }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Third Row: Map Section -->
    <div class="container-fluid mt-5">
      <div id="map"></div>
    </div>

    <div>
      <div
        class="modal fade"
        id="addDeviceModal"
        tabindex="-1"
        aria-labelledby="addDeviceModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addDeviceModalLabel">
                Add New Device
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addDevice">
                <div class="mb-3">
                  <label for="deviceName" class="form-label">Device Name</label>
                  <input
                    type="text"
                    id="deviceName"
                    class="form-control"
                    v-model="newDevice.name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="deviceLocation" class="form-label"
                    >Location</label
                  >
                  <input
                    type="text"
                    id="deviceLocation"
                    class="form-control"
                    v-model="newDevice.location"
                    required
                  />
                </div>
                <!-- <div class="mb-3">
                  <label for="deviceStatus" class="form-label">Status</label>
                  <select
                    id="deviceStatus"
                    class="form-select"
                    v-model="newDevice.status"
                    required
                  >
                  <option value=true>Active</option>
                  <option value=false>Inactive</option>
                  </select>
                </div> -->
                <div class="mb-3">
                  <label for="deviceRelay" class="form-label"
                    >Relay Status</label
                  >
                  <select
                    id="deviceRelay"
                    class="form-select"
                    v-model="newDevice.relay_status"
                    required
                  >
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="latitude" class="form-label">Latitude</label>
                  <input
                    type="text"
                    id="latitude"
                    class="form-control"
                    v-model="newDevice.latitude"
                  />
                </div>
                <div class="mb-3">
                  <label for="longitude" class="form-label">Longitude</label>
                  <input
                    type="text"
                    id="longitude"
                    class="form-control"
                    v-model="newDevice.longitude"
                  />
                </div>
                <button
                  type="submit"
                  class="btn"
                  style="background-color: #1a2d4a; color: white"
                >
                  Add Device
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Device Modal -->
      <div
        class="modal fade"
        id="update_device"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updateDeviceModalLabel">
                Update Device
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateDevice">
                <div class="mb-3">
                  <label for="updateDeviceName" class="form-label"
                    >Device Name</label
                  >
                  <input
                    type="text"
                    id="updateDeviceName"
                    class="form-control"
                    v-model="selectedDevice.name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="updateDeviceLocation" class="form-label"
                    >Location</label
                  >
                  <input
                    type="text"
                    id="updateDeviceLocation"
                    class="form-control"
                    v-model="selectedDevice.location"
                    required
                  />
                </div>
                <!-- <div class="mb-3">
                  <label for="updateDeviceStatus" class="form-label"
                    >Active?</label
                  >
                  <select
                    id="updateDeviceActive"
                    class="form-select"
                    v-model="selectedDevice.active"
                    required
                  >
                    <option value=true>Active</option>
                    <option value=false>Inactive</option>
                  </select>
                </div> -->
                <div class="mb-3">
                  <label for="latitude" class="form-label">Latitude</label>
                  <input
                    type="text"
                    id="latitude"
                    class="form-control"
                    v-model="selectedDevice.latitude"
                  />
                </div>
                <div class="mb-3">
                  <label for="longitude" class="form-label">Longitude</label>
                  <input
                    type="text"
                    id="longitude"
                    class="form-control"
                    v-model="selectedDevice.longitude"
                  />
                </div>
                <button
                  type="submit"
                  class="btn"
                  style="background-color: #1a2d4a; color: white"
                >
                  Update Device
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { db } from "../firebase";
import { push, ref as dbRef, onValue, update, remove } from "firebase/database";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const bulbs = ref([]);
const logs = ref([]);
const bulbsRef = dbRef(db, "bulbs");
const logsRef = dbRef(db, "logs");

// Selected device for update
const selectedDevice = ref({});
const map = ref(null); // Reference to the map
const markersLayer = ref(null); // Layer group for markers

// Open update modal and populate the fields
const openUpdateModal = (device) => {
  selectedDevice.value = { ...device }; // Clone the device object
};

// Update device details
const updateDevice = async () => {
  try {
    await update(dbRef(db, `bulbs/${selectedDevice.value.id}`), {
      name: selectedDevice.value.name,
      location: selectedDevice.value.location,
      active: selectedDevice.value.active=="true"?true:false ,
      latitude: selectedDevice.value.latitude,
      longitude: selectedDevice.value.longitude,
    });

    console.log("Device updated successfully!");
  } catch (error) {
    console.error("Error updating device:", error);
  }
};

// Delete device
const deleteDevice = async (deviceId) => {
  if (confirm("Are you sure you want to delete this device?")) {
    try {
      await remove(dbRef(db, `bulbs/${deviceId}`));
      console.log("Device deleted successfully!");
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  }
};

// Reactive data for the new device form
const newDevice = ref({
  name: "",
  location: "",
  status: "Active",
  relay_status: "OFF",
  active: true,
  latitude: "",
  longitude: "",
});

// Add new device
const addDevice = async () => {
  try {
    const newDeviceRef = await push(bulbsRef, { ...newDevice.value });
    console.log("New device added with ID:", newDeviceRef.key);
    Object.assign(newDevice.value, {
      name: "",
      location: "",
      status: "Active",
      relay_status: "OFF",
      active: true,
      latitude: "",
      longitude: "",
    });
 
  

  } catch (error) {
    console.error("Error adding new device:", error);
  }
};

// Initialize map and markers
const initializeMap = () => {
  const clsuCoordinates = [15.7301769, 120.9298825]; // CLSU coordinates
  map.value = L.map("map").setView(clsuCoordinates, 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  markersLayer.value = L.layerGroup().addTo(map.value); // Layer for markers
};

const updateMapMarkers = (data) => {
  markersLayer.value.clearLayers(); // Clear existing markers

// Define the icon size
const iconSize = [40, 40];

data.forEach((bulb) => {
  if (bulb.latitude && bulb.longitude) {
    // Determine the color based on status
    const markerColor = bulb.status === "Active" ? "green" : "red";

    // Create the icon with the dynamic color
    const markerIcon = L.divIcon({
      className: "fa-2x",
      html: `<i class="fas fa-map-marker-alt" style="color:${markerColor};"></i>`,
      iconSize: iconSize,
    });

    // Add the marker to the map with the custom icon
    L.marker([bulb.latitude, bulb.longitude], { icon: markerIcon })
      .addTo(markersLayer.value)
      .bindPopup(
        `<b>${bulb.name || "Bulb"}</b><br>Status: ${bulb.status || "N/A"}`
      );
  }
});

};

onMounted(() => {
  initializeMap();

  onValue(bulbsRef, (snapshot) => {
    bulbs.value = [];
    const bulbsData = snapshot.val();
    for (let id in bulbsData) {
      bulbs.value.push({ id, ...bulbsData[id] });
    }
    updateMapMarkers(bulbs.value); // Update markers on data change
  });

  onValue(logsRef, (snapshot) => {
  logs.value = [];
  const logsData = snapshot.val();

  for (let id in logsData) {
    try {
      // Replace single quotes with double quotes in the JSON string
      const correctedData = logsData[id].replace(/'/g, '"');
      const parsedLog = JSON.parse(correctedData);
      logs.value.push({ id, ...parsedLog });
    } catch (error) {
      console.error("Failed to parse log data:", logsData[id], error);
    }
  }

  // Sort logs by date, newer first
  logs.value.sort((a, b) => new Date(b.time) - new Date(a.time));

  console.log("Sorted logs.value:", logs.value);
});


});

// Computed properties for counts
const totalDevices = computed(() => bulbs.value.length);
const totalActive = computed(
  () => bulbs.value.filter((device) => device.active== true).length
);
const totalInactive = computed(
  () => bulbs.value.filter((device) => device.active == false).length
);
const totalOn = computed(
  () => bulbs.value.filter((device) => device.status === "ON").length
);
const totalOff = computed(
  () => bulbs.value.filter((device) => device.status === "OFF").length
);

const toggleStatus = (device) => {
  const updatedStatus = device.relay_status === "ON" ? "OFF" : "ON";

  update(dbRef(db, `bulbs/${device.id}`), { relay_status: updatedStatus });

  const formatDateTime = (date) => {
  const pad = (num) => String(num).padStart(2, '0'); // Pads single digits with a leading zero
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

const logEntry = {
  device_name: device.name,
  device_id: device.id,
  time: formatDateTime(new Date()), // Use the custom formatter
  status: device.ac_voltage > 190 ? "OFF" : "ON",
};

push(logsRef, JSON.stringify(logEntry));

};
</script>

<style scoped>
html,
body,
#map-container {
  height: 100%; /* Full height of the viewport */
  margin: 0; /* Remove default margins */
}

.container-fluid {
  padding: 0;
}
#map {
  height: 100vh;
  width: 100%;
}
.card-device:hover {
  box-shadow: 0 3px 10px #ebebeb;
  transition: ease-in-out 0.2s;
}
</style>
