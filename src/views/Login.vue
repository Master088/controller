<template>
  <main>
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Welcome back!</h3>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">User name</label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-control"
                placeholder="Enter user name"
                required
                v-model="email"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <div class="input-group">
                <input
                  :type="passwordFieldType"
                  id="password"
                  name="password"
                  class="form-control"
                  placeholder="Enter password"
                  required
                  v-model="password"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="togglePasswordVisibility"
                >
                  <i
                    v-if="passwordFieldType === 'password'"
                    class="bi bi-eye"
                  ></i>
                  <i
                    v-else
                    class="bi bi-eye-slash"
                  ></i>
                </button>
              </div>
            </div>
            <div class="d-grid">
              <button
                type="submit"
                class="btn btn-success btn-block"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Log in</span>
                <span v-else>
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </span>
              </button>
            </div>
            <p v-if="errorMessage" class="text-danger text-center mt-3">
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const passwordFieldType = ref("password");
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard"); // Redirect to dashboard after login
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const togglePasswordVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === "password" ? "text" : "password";
};
</script>

<style>
.bg-gradient {
  background: linear-gradient(
    to right,
    #064e3b,
    #065f46,
    #047857
  );
  color: #f9fafb;
}
</style>
