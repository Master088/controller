<template>
  <div>
    <div class="row">
  <!-- Column to align the button to the right -->
  <div class="col-auto ms-auto">
    <!-- Button to Trigger Modal (Add New Device) -->
    <button type="button" class="btn btn-success mb-4" data-bs-toggle="modal" data-bs-target="#addDeviceModal">
      Add New Device
    </button>
  </div>
</div>



    <!-- First Row: Cards for Total Devices, Total Active, Total On, Total Off -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Devices</h5>
            <p class="card-text">245</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Active</h5>
            <p class="card-text">120</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total On</h5>
            <p class="card-text">90</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Off</h5>
            <p class="card-text">30</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Second Row: Device Cards and Log -->
    <div class="row mb-4">
      <!-- Device Cards (75% width) -->
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-4 mb-3" v-for="device in bulbs" :key="device.id">
            <div class="card">
              <div class="card-body">
                <!-- Bulb Icon (On its own row above the device name) -->
                <div class="text-center mb-3">
                  <!-- Display bulb icon with dynamic color based on status -->
                  <i 
                    class="fas fa-lightbulb" 
                    :style="{
                      color: device.status == true ? 'yellow' : 'gray',
                      fontSize: '60px'
                    }">
                  </i>
                </div>
                <div class="text-center">
                  <h5 class="card-title">{{ device.name }}</h5>
                  <p class="card-text">Location: {{ device.location }}</p>
                  <p class="card-text">
                    Status:
                    <span :class="device.status == true ? 'text-success' : 'text-danger'">{{ device.status }}</span>
                  </p>
                  <!-- Toggle for On/Off Status -->
                  <div class="form-check form-switch">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      :checked="device.status === true" 
                      @change="toggleStatus(device)" />
                    <label class="form-check-label">
                      {{ device.status === true ? 'Turn Off' : 'Turn On' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Log (25% width) -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Device Log</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="log in logs" :key="log.id">
                <strong>{{ log.deviceName }}</strong> - {{ log.deviceId }} - {{ log.dateTime }} - <span :class="log.status === 'Active' ? 'text-success' : 'text-danger'">{{ log.status }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Third Row: Map Section -->
    <div class="container-fluid p-0">
      <MapComponent />
    </div>

    <!-- Modal for Adding New Device -->
    <div class="modal fade" id="addDeviceModal" tabindex="-1" aria-labelledby="addDeviceModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addDeviceModalLabel">Add New Device</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addDevice">
              <div class="mb-3">
                <label for="name" class="form-label">Device Name</label>
                <input type="text" class="form-control" id="name" v-model="newDevice.name" required />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" class="form-control" id="location" v-model="newDevice.location" required />
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" v-model="newDevice.status" required>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="relayStatus" class="form-label">Relay Status</label>
                <select class="form-select" id="relayStatus" v-model="newDevice.relayStatus" required>
                  <option value="On">On</option>
                  <option value="Off">Off</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="active" class="form-label">Active</label>
                <input type="checkbox" id="active" v-model="newDevice.active" />
              </div>
              <div class="mb-3">
                <label for="latitude" class="form-label">Latitude</label>
                <input type="number" class="form-control" id="latitude" v-model="newDevice.latitude" required />
              </div>
              <div class="mb-3">
                <label for="longitude" class="form-label">Longitude</label>
                <input type="number" class="form-control" id="longitude" v-model="newDevice.longitude" required />
              </div>
              <button type="submit" class="btn btn-primary">Add Device</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { db } from '../firebase';
import { push, ref as dbRef, onValue, update } from 'firebase/database';
import MapComponent from '../components/MapComponent.vue'; // Import MapComponent
  

const bulbName = ref('');
const bulbLocation = ref('');
const bulbs = ref([]);
const bulbsRef = dbRef(db, 'bulbs');

const addBulb = () => {
  push(bulbsRef, {
    name: bulbName.value,
    location: bulbLocation.value,
    status: 'false'
  });

  bulbName.value = '';
  bulbLocation.value = '';
};


  // Example devices and logs data
  const devices = [
    { id: 1, name: 'Device 1', location: 'Office 1', status: 'Active' },
    { id: 2, name: 'Device 2', location: 'Office 2', status: 'Inactive' },
    { id: 3, name: 'Device 3', location: 'Office 3', status: 'Active' }
  ];

  const logs = [
    { id: 1, deviceName: 'Device 1', deviceId: '001', dateTime: '2024-12-08 10:00', status: 'Active' },
    { id: 2, deviceName: 'Device 2', deviceId: '002', dateTime: '2024-12-08 10:30', status: 'Inactive' }
  ];

  // Reactive data for the new device form
  const newDevice = {
    name: '',
    location: '',
    status: 'Active',
    relayStatus: 'On',
    active: true,
    latitude: '',
    longitude: ''
  };

  // Method to toggle device status (On/Off)
  const toggleStatus = (device) => {
    device.status = device.status === 'Active' ? 'Inactive' : 'Active';
  };

  // Method to add new device
  const addDevice = () => {
    // You can add the new device to the devices array or perform an API call
    devices.push({ ...newDevice, id: devices.length + 1 });
    // Reset the form fields after adding the device
    Object.assign(newDevice, {
      name: '',
      location: '',
      status: true,
      relay_status: true,
      ac_voltage:100,
      active: true,
      latitude: '',
      longitude: ''
    });
    // Close the modal
    const modal = new bootstrap.Modal(document.getElementById('addDeviceModal'));
    modal.hide();
  };

  onMounted(() => {
  onValue(bulbsRef, (snapshot) => {
    bulbs.value = [];
    const bulbsData = snapshot.val();
    console.log("bulbsData ",bulbsData )
    for (let id in bulbsData) {
      bulbs.value.push({ id, ...bulbsData[id] });
    }
  });

  console.log(" bulbs", bulbs.value)  
});
</script>

<style scoped>
  html, body, #map-container {
    height: 100%;  /* Full height of the viewport */
    margin: 0;     /* Remove default margins */
  }

  .container-fluid {
    padding: 0;
  }
</style>
