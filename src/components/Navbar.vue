
<template>
  <!-- Premium Glass Navbar -->
  <nav class="navbar fixed-top navbar-glass">
    <div class="container-fluid px-3 px-md-4">
      <div class="nav-inner w-100 d-flex align-items-center justify-content-between">
        <!-- Left: Brand + Quick Nav -->
        <div class="d-flex align-items-center gap-3">
          <div class="brand d-flex align-items-center gap-2">
            <div class="brand-mark">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="d-none d-sm-block">
              <div class="brand-title">Smart Light</div>
              <div class="brand-sub">Control & Monitoring</div>
            </div>
          </div>

          <!-- Optional quick links (keeps bootstrap vibe) -->
          <div class="d-none d-md-flex align-items-center gap-2 ms-2">
            <router-link to="/dashboard" class="nav-pill" active-class="nav-active">
              <i class="fas fa-gauge-high me-2"></i> Dashboard
            </router-link>
            <router-link to="/map" class="nav-pill" active-class="nav-active">
              <i class="fas fa-map-location-dot me-2"></i> Map
            </router-link>
          </div>
        </div>

        <!-- Right: User + Actions -->
        <div class="d-flex align-items-center gap-2">
          <!-- Status -->
          <div class="status-pill d-none d-sm-inline-flex">
            <span class="dot"></span>
            Online
          </div>

          <!-- Profile (dropdown) -->
          <div class="dropdown">
            <button
              class="btn btn-profile magnetic"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @mousemove="magnetMove"
              @mouseleave="magnetLeave"
            >
              <img
                class="avatar"
                :src="user?.photoURL || 'https://via.placeholder.com/40'"
                alt="User profile"
              />
              <span class="d-none d-lg-inline text-white-75 fw-semibold">
                {{ user?.displayName || "User" }}
              </span>
              <i class="fas fa-chevron-down text-white-50 small ms-2 d-none d-lg-inline"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end dropdown-dark">
              <li class="px-3 pt-2 pb-1">
                <div class="text-white fw-bold">{{ user?.displayName || "User" }}</div>
                <div class="text-white-50 small">{{ user?.email || "" }}</div>
              </li>

              <li><hr class="dropdown-divider opacity-25" /></li>

              <li>
                <button class="dropdown-item" type="button" @click="goDashboard">
                  <i class="fas fa-gauge-high me-2"></i> Dashboard
                </button>
              </li>

              <li>
                <button class="dropdown-item" type="button" @click="refreshRoute">
                  <i class="fas fa-rotate me-2"></i> Refresh
                </button>
              </li>

              <li><hr class="dropdown-divider opacity-25" /></li>

              <li>
                <button class="dropdown-item text-danger" type="button" @click="signOut">
                  <i class="fas fa-right-from-bracket me-2"></i> Sign out
                </button>
              </li>
            </ul>
          </div>

          <!-- Mobile: quick signout button (optional) -->
          <button
            class="btn btn-signout d-sm-none"
            type="button"
            @click="signOut"
            aria-label="Sign out"
          >
            <i class="fas fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Subtle bottom glow line -->
    <div class="nav-glow"></div>
  </nav>

  <!-- Spacer so content doesn't hide behind fixed navbar -->
  <div class="nav-spacer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

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
    router.push("/auth/login");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const goDashboard = () => router.push("/dashboard");

const refreshRoute = () => {
  // quick refresh without full reload
  router.replace({ path: "/__refresh__" }).catch(() => {});
  router.replace({ path: router.currentRoute.value.fullPath }).catch(() => {});
};

/** Magnetic hover (premium micro-interaction) */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const magnetMove = (e) => {
  if (prefersReducedMotion) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - (r.left + r.width / 2);
  const y = e.clientY - (r.top + r.height / 2);
  el.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
};

const magnetLeave = (e) => {
  e.currentTarget.style.transform = "translate(0px, 0px)";
};
</script>

<style scoped>
/* NAV BAR GLASS */
.navbar-glass {
  background: rgba(15, 23, 42, 0.72) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  z-index: 1000;
}

.nav-inner {
  gap: 10px;
}

/* spacer under fixed navbar */
.nav-spacer {
  height: 72px;
}

/* bottom glow */
.nav-glow {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.9), rgba(99, 102, 241, 0.9), transparent);
  opacity: 0.35;
}

/* BRAND */
.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(99, 102, 241, 0.18));
  border: 1px solid rgba(168, 85, 247, 0.25);
}
.brand-title {
  color: #fff;
  font-weight: 900;
  line-height: 1.1;
}
.brand-sub {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  line-height: 1.1;
}

/* NAV PILLS */
.nav-pill {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 220ms ease;
}
.nav-pill:hover {
  transform: translateY(-1px);
  color: #fff;
  border-color: rgba(168, 85, 247, 0.35);
  background: rgba(168, 85, 247, 0.14);
}
.nav-active {
  color: #fff !important;
  background: rgba(168, 85, 247, 0.18) !important;
  border-color: rgba(168, 85, 247, 0.4) !important;
}

/* STATUS */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.24);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 1);
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
  animation: pulseDot 1.6s ease-in-out infinite;
}
@keyframes pulseDot {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.08);
  }
}

/* PROFILE */
.btn-profile {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  transition: 200ms ease;
}
.btn-profile:hover {
  transform: translateY(-1px);
  border-color: rgba(168, 85, 247, 0.35);
  background: rgba(255, 255, 255, 0.09);
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* dropdown */
.dropdown-dark {
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
  min-width: 260px;
}
.dropdown-dark .dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 700;
  padding: 10px 14px;
}
.dropdown-dark .dropdown-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.dropdown-dark .dropdown-item.text-danger:hover {
  background: rgba(239, 68, 68, 0.12);
}

/* Mobile signout */
.btn-signout {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}

/* Magnetic */
.magnetic {
  transition: transform 140ms ease;
  will-change: transform;
}

/* Make sure bootstrap doesn't override */
.navbar.navbar-light {
  background-color: transparent !important;
}
</style>
