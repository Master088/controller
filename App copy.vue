<script setup>
import MapComponent from './components/MapComponent.vue'; // Import MapComponent
</script>

<template>
  <div id="map-container">
    <h1>Hello</h1>
    <MapComponent />
  </div>
</template>

<style>
/* Global styles */

html, body, #map-container {
  height: 100%;  /* Full height of the viewport */
  margin: 0;     /* Remove default margins */
}

#map-container {
  width: 100%;   /* Full width */
}
</style>
