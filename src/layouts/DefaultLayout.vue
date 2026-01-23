<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="default-layout">
    <Navbar />
    <div class="content-wrapper">
      <main>
        <router-view />
      </main>

      <footer class="footer-gradient text-white py-4 mt-5">
        <div class="container">
          <hr class="my-4 border-gray-700" />
          <span class="d-block text-center small">
            © 2026
            <a
              href="https://flowbite.com/"
              class="text-decoration-none text-white hover-underline"
              >SMART LIGHT CONTROL AND MONITORING™</a
            >. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";

export default {
  name: "DefaultLayout",
  components: {
    Navbar,
  },
};
</script>
 
<style scoped>
/* Full dark gradient background */
.default-layout {
  min-height: 100vh;
  background: radial-gradient(900px 500px at 10% 10%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(168, 85, 247, 0.18), transparent 60%),
    radial-gradient(900px 500px at 30% 90%, rgba(34, 211, 238, 0.10), transparent 55%);
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* Content wrapper to push footer to bottom */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Main area padding */
main {
  flex: 1;
  /* padding: 20px; */
}

/* Footer gradient */
.footer-gradient {
  background: linear-gradient(145deg, rgba(26, 30, 43, 0.8), rgba(44, 62, 80, 0.8));
  border-radius: 12px 12px 0 0;
}

/* Links hover */
a.hover-underline:hover {
  text-decoration: underline;
}

/* HR styling */
hr {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
