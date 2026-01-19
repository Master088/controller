<template>
  <main>
    <div
      class="d-flex justify-content-center align-items-center min-vh-100 bg-gradient"
    >
      <section
        class="py-3 px-5 py-md-5 py-xl-8 rounded-2"
        style="background-color: #1a2d4a"
      >
        <div class="container">
          <div class="row gy-4 align-items-center">
            <div class="col-12 col-md-6 col-xl-7">
              <div class="d-flex">
                <div class="col-12 col-xl-9 text-center">
                  <img
                    class="img-fluid rounded mb-4"
                    loading="lazy"
                    src="../assets/undraw_date_night_bda8.svg"
                  />
                  <hr class="border-primary-subtle mb-4" />
                  <h2 class="h1 mb-2">SMART LIGHT CONTROL AND MONITORING</h2>
                  <p class="mb-5" style="color: #d9d9d9">
                    Efficient Lighting Management for Smarter Streets
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 col-xl-5">
              <div
                class="card border-0 rounded-2"
                style="background-color: #f5f5f5"
              >
                <div class="card-body p-3 p-md-4 p-xl-5">
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-4">
                        <h3>Log in</h3>
                      </div>
                    </div>
                  </div>
                  <form @submit.prevent="login">
                    <div class="row gy-3 overflow-hidden">
                      <div class="col-12">
                        <div class="form-floating mb-3">
                          <input
                            type="email"
                            class="form-control"
                            name="username"
                            id="username"
                            placeholder="Enter user name"
                            required
                            v-model="email"
                          />
                          <label for="username" class="form-label"
                            >Username</label
                          >
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-floating mb-3">
                          <input
                            type="password"
                            class="form-control"
                            name="password"
                            id="password"
                            value=""
                            placeholder="Password"
                            required
                            v-model="password"
                          />
                          <label for="password" class="form-label"
                            >Password</label
                          >
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="d-grid">
                          <button
                            type="submit"
                            class="btn btn-block"
                            style="
                              background-color: #1a2d4a !important;
                              color: white;
                            "
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
                        <p
                          v-if="errorMessage"
                          class="text-danger text-center mt-3"
                        >
                          {{ errorMessage }}
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
  background: linear-gradient(to right, #064e3b, #065f46, #047857);
  color: #f9fafb;
}
</style>
