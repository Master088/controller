<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <div class="d-flex justify-content-between w-100">
        <!-- Hamburger button for mobile view (optional) -->
        <!-- <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button> -->
        

        <!-- User profile section aligned to the right -->
        <div class="d-flex align-items-center ms-auto">
            <button
                class="dropdown-item text-danger"
                @click="signOut"
              >
                Sign out
              </button>
          <!-- Dropdown button -->
          <!-- <button
            class="btn btn-link dropdown-toggle"
            type="button"
            id="userMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              class="rounded-circle"
              :src="user?.photoURL || 'https://via.placeholder.com/40'"
              alt="User profile"
              width="40"
              height="40"
            />
          </button> -->

          <!-- Dropdown menu -->
          <!-- <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
            <li>
              <a class="dropdown-item" href="#">
                <strong>{{ user?.displayName }}</strong>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <small>{{ user?.email }}</small>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <button
                class="dropdown-item text-danger"
                @click="signOut"
              >
                Sign out
              </button>
            </li>
          </ul> -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    user.value = null;
    router.push('/auth/login'); // Redirect to login page after signout
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<style scoped>
/* Optionally, add custom styles here */
</style>
