import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Orders from '../components/Orders.vue';
import OrderDetails from '../components/OrderDetails.vue'; // Import OrderDetails component

const routes = [
  { path: '/', component: Login }, // Default route
  { path: '/orders', component: Orders }, // Route for Orders
  { path: '/login', component: Login }, // Login route
  { path: '/order-details/:id', component: OrderDetails }, // Route for Order Details
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
