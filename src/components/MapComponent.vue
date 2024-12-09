<template>
    <div id="map"></div> <!-- Map container -->
  </template>
  
  <script setup>
  import { onMounted } from 'vue'; // Import onMounted from Vue
  import L from 'leaflet'; // Import Leaflet
  import 'leaflet/dist/leaflet.css'; // Leaflet CSS
  import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS
  
  onMounted(() => {
    // Coordinates for Central Luzon State University (CLSU)
    const clsuCoordinates = [15.7301769, 120.9298825]; // CLSU coordinates
    // Exact Coordinates for Lingap
    const lingapCoordinates = [15.7430995, 120.9351836]; // Lingap coordinates
    // Coordinates for the new yellow marker
    const newCoordinates = [15.736611, 120.929593]; // New yellow marker coordinates
  
    // Initialize map with CLSU coordinates and zoom level 15 for street view
    const map = L.map('map').setView(clsuCoordinates, 17); // Zoom level 15
  
    // Add OpenStreetMap tile layer for street-level view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    // Create custom icons for markers using Font Awesome
    const redIcon = L.divIcon({
      className: 'fa-2x',
      html: '<i class="fas fa-map-marker-alt" style="color:red;"></i>',
      iconSize: [40, 40], // Adjusted size for the icon
    });
  
    const blueIcon = L.divIcon({
      className: 'fa-2x',
      html: '<i class="fas fa-map-marker-alt" style="color:blue;"></i>',
      iconSize: [40, 40], // Adjusted size for the icon
    });
  
    const yellowIcon = L.divIcon({
      className: 'fa-2x',
      html: '<i class="fas fa-map-marker-alt" style="color:yellow;"></i>',
      iconSize: [40, 40], // Adjusted size for the icon
    });
  
    // Add markers with custom icons
    L.marker(clsuCoordinates, { icon: redIcon }).addTo(map)
      .bindPopup("<b>Central Luzon State University</b>")
      .openPopup();
  
    L.marker(lingapCoordinates, { icon: blueIcon }).addTo(map)
      .bindPopup("<b>Lingap</b>")
      .openPopup();
  
    L.marker(newCoordinates, { icon: yellowIcon }).addTo(map)
      .bindPopup("<b>New Location (Yellow Marker)</b>")
      .openPopup();
  
    // Add click event to dynamically add markers
    map.on('click', function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      L.marker([lat, lng]).addTo(map);
    });
  });
  </script>
  
  <style scoped>
  /* Map container to take full screen size */
  #map {
    height: 100vh;
    width: 100%;
  }
  </style>
  