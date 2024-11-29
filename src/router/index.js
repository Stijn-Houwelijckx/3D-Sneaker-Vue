import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Orders from '../components/Orders.vue';

const routes = [
  { path: '/', component: Login }, // Default route
  { path: '/orders', component: Orders }, // Route for Orders
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
