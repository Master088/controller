<template>
  <div class="mt-5">
    <div class="container-fluid">
      <div class="d-flex justify-content-between mb-5">
        <h3>Dashboard</h3>
        <button
          type="button"
          class="btn btn-success"
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
          <div class="col">
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
          </div>
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
        <div class="col-8">
          <div class="row mb-4">
            <div>
              <!-- Device Cards -->
              <div class="row">
                <div
                  class="col-md-4 mb-4"
                  v-for="device in bulbs"
                  :key="device.id"
                >
                  <div class="card">
                    <div class="card-body position-relative">
                      <div class="text-center mb-3">
                        <i
                          class="fas fa-lightbulb"
                          :style="{
                            color:
                              device.status === 'Active' ? 'yellow' : 'gray',
                            fontSize: '60px',
                          }"
                        ></i>
                      </div>
                      <div class="text-center">
                        <h5 class="card-title">{{ device.name }}</h5>
                        <p class="card-text">Location: {{ device.location }}</p>
                        <p class="card-text">
                          Status:
                          <span
                            :class="
                              device.status === 'Active'
                                ? 'text-success'
                                : 'text-danger'
                            "
                          >
                            {{ device.status }}
                          </span>
                        </p>
                        <div class="form-check form-switch">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="device.status === 'Active'"
                            @change="toggleStatus(device)"
                          />
                          <label class="form-check-label">
                            {{
                              device.status === "Active"
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
                            class="btn btn-sm btn-light"
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
          <div class="col" style="max-height: 700px; overflow-y: auto">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Device Log</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="log in logs" :key="log.id">
                    <strong>{{ log.deviceName }}</strong> - {{ log.dateTime }} -
                    <span
                      :class="
                        log.status === 'Active' ? 'text-success' : 'text-danger'
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
    <div class="container-fluid">
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
                <div class="mb-3">
                  <label for="deviceStatus" class="form-label">Status</label>
                  <select
                    id="deviceStatus"
                    class="form-select"
                    v-model="newDevice.status"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                    <option value="On">On</option>
                    <option value="Off">Off</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="latitude" class="form-label">Latitude</label>
                  <input
                    type="text"
                    id="latitude"
                    class="form-control"
                    v-model="newDevice.latitude"
                    placeholder="Optional"
                  />
                </div>
                <div class="mb-3">
                  <label for="longitude" class="form-label">Longitude</label>
                  <input
                    type="text"
                    id="longitude"
                    class="form-control"
                    v-model="newDevice.longitude"
                    placeholder="Optional"
                  />
                </div>
                <button type="submit" class="btn btn-success">
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
                <div class="mb-3">
                  <label for="updateDeviceStatus" class="form-label"
                    >Status</label
                  >
                  <select
                    id="updateDeviceStatus"
                    class="form-select"
                    v-model="selectedDevice.status"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">
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
import MapComponent from "../components/MapComponent.vue"; // Import MapComponent
import L from 'leaflet'; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS

const bulbs = ref([]);
const logs = ref([]);
const bulbsRef = dbRef(db, "bulbs");
const logsRef = dbRef(db, "deviceLogs");

// Selected device for update
const selectedDevice = ref({});

// Open update modal and populate the fields
// import { Modal } from 'bootstrap';

const openUpdateModal = (device) => {
  selectedDevice.value = { ...device }; // Clone the device object
};

// Update device details
const updateDevice = async () => {
  try {
    // Update Firebase
    await update(dbRef(db, `bulbs/${selectedDevice.value.id}`), {
      name: selectedDevice.value.name,
      location: selectedDevice.value.location,
      status: selectedDevice.value.status,
    });

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("updateDeviceModal")
    );
    modal.hide();

    // Log success
    console.log("Device updated successfully!");
  } catch (error) {
    console.error("Error updating device:", error);
  }
};

// Delete device
const deleteDevice = async (deviceId) => {
  if (confirm("Are you sure you want to delete this device?")) {
    try {
      // Remove from Firebase
      await remove(dbRef(db, `bulbs/${deviceId}`));

      // Log success
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
  relay_status: "On",
  active: true,
  latitude: "",
  longitude: "",
});

// Method to add new device
const addDevice = async () => {
  try {
    // Push the new device to Firebase
    const newDeviceRef = await push(bulbsRef, { ...newDevice.value });

    // Log success message
    console.log("New device added with ID:", newDeviceRef.key);

    // Reset form fields
    Object.assign(newDevice.value, {
      name: "",
      location: "",
      status: "Active",
      relay_status: "On",
      active: true,
      latitude: "",
      longitude: "",
    });
  } catch (error) {
    console.error("Error adding new device:", error);
  }
};

onMounted(() => {
  onValue(bulbsRef, (snapshot) => {
    bulbs.value = [];
    const bulbsData = snapshot.val();
    for (let id in bulbsData) {
      bulbs.value.push({ id, ...bulbsData[id] });
    }
  });

  onValue(logsRef, (snapshot) => {
    logs.value = [];
    const logsData = snapshot.val();
    for (let id in logsData) {
      logs.value.push({ id, ...logsData[id] });
    }
    console.log(" bulbs", bulbs.value) 

    initializeMapMarker(bulbs.value)
  });
});


const initializeMapMarker = (data) => {

console.log("data11111111",data)
const clsuCoordinates = [15.7301769, 120.9298825]; // CLSU coordinates
const map = L.map('map').setView(clsuCoordinates, 17); // Initialize map

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Custom icons
const redIcon = L.divIcon({
  className: 'fa-2x',
  html: '<i class="fas fa-map-marker-alt" style="color:red;"></i>',
  iconSize: [40, 40],
});

// Place markers for each bulb in data
data.forEach((bulb) => {
  console.log("here",bulb )
  if (bulb.latitude && bulb.longitude) {
  
    L.marker([bulb.latitude, bulb.longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup(`<b>${bulb.name || 'Bulb'}</b><br>Status: ${bulb.status || 'N/A'}`);
  }
});


map.on('click', function (e) {
  const { lat, lng } = e.latlng;
  L.marker([lat, lng], { icon: redIcon }).addTo(map);
});
};



// Computed properties for counts
const totalDevices = computed(() => bulbs.value.length);
const totalActive = computed(
  () => bulbs.value.filter((device) => device.status === "Active").length
);
const totalInactive = computed(
  () => bulbs.value.filter((device) => device.status === "Inactive").length
);
const totalOn = computed(
  () => bulbs.value.filter((device) => device.status === "On").length
);
const totalOff = computed(
  () => bulbs.value.filter((device) => device.status === "Off").length
);

const toggleStatus = (device) => {
  const updatedStatus = device.status === "Active" ? "Inactive" : "Active";
  update(dbRef(db, `bulbs/${device.id}`), { status: updatedStatus });

  const logEntry = {
    deviceName: device.name,
    deviceId: device.id,
    dateTime: new Date().toLocaleString(),
    status: updatedStatus,
  };
  push(logsRef, logEntry);
};
</script>

<style scoped>
  html, body, #map-container {
    height: 100%;  /* Full height of the viewport */
    margin: 0;     /* Remove default margins */
  }

  .container-fluid {
    padding: 0;
  }
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
