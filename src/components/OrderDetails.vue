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
              v-model="tempStatus"
              class="status-dropdown"
              :class="statusClass(tempStatus)"
              @change="showConfirmationModal"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="In production">In Production</option>
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

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Status Change</h2>
        <p>
          Are you sure you want to change the status of Order ID
          "{{ order._id }}" to "{{ tempStatus }}"?
        </p>
        <div class="modal-actions">
          <button class="confirm-button" @click="confirmStatusChange">Confirm</button>
          <button class="cancel-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",
  data() {
    return {
      order: null,
      tempStatus: null, // Temporary status before confirmation
      loading: true,
      error: null,
      showModal: false,
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
        case "In production":
          return "border-production";
        default:
          return "";
      }
    },
    showConfirmationModal() {
      this.showModal = true; // Open the modal
    },
    async confirmStatusChange() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }

        const response = await fetch(
          `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.order._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order: { status: this.tempStatus }, // Send tempStatus in the request
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Order status updated successfully:", data);

        // Update the actual status only after confirmation
        this.order.status = this.tempStatus;
        this.closeModal(); // Close the modal
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    },
    closeModal() {
      this.showModal = false;
      this.tempStatus = this.order.status; // Revert tempStatus to the original value
    },
  },
  async mounted() {
    const orderId = this.$route.params.id; // Get the order ID from the route parameters
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

      // Find the specific order by ID
      this.order = orders.find((order) => order._id === orderId);

      if (!this.order) {
        throw new Error("Order not found.");
      }

      this.tempStatus = this.order.status; // Initialize tempStatus with the current status
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background-color: white;
  color: black;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.modal h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: black;
}

.modal p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.confirm-button {
  background-color: #64f244;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

.cancel-button {
  background-color: #f24444;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

.confirm-button:hover,
.cancel-button:hover {
  opacity: 0.8;
}

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
