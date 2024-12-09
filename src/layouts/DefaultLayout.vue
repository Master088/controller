<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class=" ">
    <Navbar />
    <h1>Hello</h1>
    <div  >
     
      <main  >
        <router-view />
      </main>

      <footer class="bg-dark text-white py-4">
  <div class="container">
    <hr class="my-4 border-gray-700" />
    <span class="d-block text-center small">
      © 2024 <a href="https://flowbite.com/" class="text-decoration-none text-white hover-underline">CLSU EGGVENTORY™</a>. All Rights Reserved.
    </span>
  </div>
</footer>


    </div>



  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
 


export default {
  name: 'DefaultLayout',
  components: {
    Navbar,
 
  },
};
</script>

<style scoped>
 

main {
  padding: 20px;
}
</style>
