import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

import { auth } from "../firebase";
const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/auth/login",
    children: [
      {
        path: "/auth/login",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
    ],
  },

  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("../views/Dashboard.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  auth.onAuthStateChanged((user) => {
    if (requiresAuth && !user) {
      next("/auth/login");
    } else if (!requiresAuth && user) {
      next("/");
    } else {
      next();
    }
  });
});
export default router;
