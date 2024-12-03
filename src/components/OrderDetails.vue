<template>
  <div class="order-details-container">
    <h1 class="header">Order Details</h1>

    <div v-if="order" class="order-details-content">
      <!-- General Order Information -->
      <section class="section">
        <h2 class="section-header">Order Summary</h2>
        <div class="info-row">
          <p><strong>Order ID:</strong> {{ order._id }}</p>
          <p><strong>Order Date:</strong> {{ formattedDate }}</p>
        </div>
        <div class="info-row">
          <div class="status-group">
            <p><strong>Status:</strong></p>
            <select
              v-model="order.status"
              class="status-dropdown"
              :class="statusClass(order.status)"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Production">In Production</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Customer Information -->
      <section class="section">
        <h2 class="section-header">Customer Information</h2>
        <div class="info-row">
          <p><strong>Name:</strong> {{ order.user.name }}</p>
          <p><strong>Email:</strong> {{ order.user.email }}</p>
        </div>
        <div class="info-row">
          <p>
            <strong>Address:</strong>
            {{ order.user.address.street }}, {{ order.user.address.houseNr }},
            {{ order.user.address.zipcode }}, {{ order.user.address.city }}
          </p>
        </div>
      </section>

      <!-- Sneaker Details -->
      <section class="section">
        <h2 class="section-header">Sneaker Details</h2>
        <table class="sneaker-table">
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Color</th>
              <th>Material</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in order.sneaker.parts" :key="part.partName">
              <td>{{ part.partName }}</td>
              <td>{{ part.color }}</td>
              <td>{{ part.material }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Back Button -->
      <div class="actions">
        <router-link to="/orders" class="button back-button">Back to Orders</router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-container">
      <p class="loading-text">Loading order details...</p>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",
  data() {
    return {
      order: null,
      loading: true,
      error: null,
    };
  },
  computed: {
    formattedDate() {
      return this.order?.orderDate
        ? new Date(this.order.orderDate).toLocaleDateString()
        : "N/A";
    },
  },
  methods: {
    statusClass(status) {
      switch (status) {
        case "Pending":
          return "border-pending";
        case "Shipped":
          return "border-shipped";
        case "Completed":
          return "border-completed";
        case "Production":
          return "border-production";
        default:
          return "";
      }
    },
  },
  async mounted() {
    const orderId = this.$route.params.id;
    const token = localStorage.getItem("token");

    if (!token) {
      this.error = "Unauthorized: No token found. Please log in.";
      this.loading = false;
      return;
    }

    try {
      const response = await fetch(
        "https://threed-sneaker-nodejs.onrender.com/api/v1/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const orders = data.data.orders;
      this.order = orders.find((order) => order._id === orderId);

      if (!this.order) {
        throw new Error("Order not found.");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

/* Full-page layout */
.order-details-container {
  padding: 2rem;
  color: white;
  background-color: black;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Header Styling */
.header {
  font-size: 2rem;
  font-weight: bold;
  color: #64f244;
  margin-bottom: 2rem;
}

/* Section Styling */
.section {
  margin-bottom: 2rem;
}

.section-header {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #64f244;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Table Styling */
.sneaker-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.sneaker-table th,
.sneaker-table td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #444;
}

.sneaker-table th {
  background-color: #222;
  color: white;
}

/* Status Dropdown Styling */
.status-dropdown {
  background-color: black;
  color: white;
  border: 2px solid #444;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1rem;
}

/* Status borders */
.border-pending {
  border-color: gray;
}

.border-shipped {
  border-color: orange;
}

.border-completed {
  border-color: green;
}

.border-production {
  border-color: yellow;
}

/* Back button */
.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
}

.button {
  padding: 0.5rem 1rem;
  background-color: #64f244;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #555;
  color: white;
}

/* Loading and Error States */
.loading-container,
.error-container {
  text-align: left;
  padding: 2rem;
}

.loading-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #64f244;
}

.error-text {
  color: red;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
