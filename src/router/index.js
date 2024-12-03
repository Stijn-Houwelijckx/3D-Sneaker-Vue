import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Orders from "../components/Orders.vue";
import OrderDetails from "../components/OrderDetails.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/orders", component: Orders, meta: { requiresAuth: true } },
  { path: "/order-details/:id", component: OrderDetails, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
