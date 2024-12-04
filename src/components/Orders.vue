<template>
  <div class="orders-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="/logo.png" alt="Logo" class="logo" />
        <div class="sidebar-links">
          <div class="nav-link active">Orders</div>
          <div class="nav-link">Settings</div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="logout-button" @click="logout">Log Out</div>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <h2>Orders</h2>
        <p>{{ orders.length }} orders found</p>
      </header>

      <div class="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order._id"
              class="order-row"
            >
              <td @click="viewOrder(order._id)">{{ order._id }}</td>
              <td @click="viewOrder(order._id)">{{ order.date }}</td>
              <td @click="viewOrder(order._id)">{{ order.customer }}</td>
              <td>
                <select
                  v-model="order.status"
                  class="status-dropdown"
                  :class="{
                    'border-pending': order.status === 'Pending',
                    'border-shipped': order.status === 'Shipped',
                    'border-completed': order.status === 'Completed',
                    'border-production': order.status === 'In production',
                  }"
                  @focus="setPreviousStatus(order)"
                  @change="showConfirmationModal(order)"
                  @click.stop
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="In production">In Production</option>
                </select>
              </td>
              <td>
                <button class="delete-button" @click="showDeleteConfirmation(order)">
                  X
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Status Change</h2>
        <p>
          Are you sure you want to change the status of Order ID
          "{{ selectedOrder._id }}" to "{{ selectedOrder.status }}"?
        </p>
        <div class="modal-actions">
          <button class="confirm-button" @click="updateOrderStatus">Confirm</button>
          <button class="cancel-button" @click="cancelStatusChange">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete Order ID "{{ selectedOrder._id }}"?
        </p>
        <div class="modal-actions">
          <button class="confirm-button" @click="deleteOrder">Confirm</button>
          <button class="cancel-button" @click="closeDeleteModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      showModal: false,
      showDeleteModal: false,
      selectedOrder: null,
      previousStatus: null, // Store the previous status before changes
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }

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
        this.orders = data.data.orders.map((order) => ({
          _id: order._id,
          date: new Date(order.orderDate).toLocaleDateString(),
          customer: order.user.name,
          status: order.status, // Properly initialize with the status from API
        }));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    setPreviousStatus(order) {
      this.previousStatus = order.status; // Store the current status before any changes
    },
    showConfirmationModal(order) {
      this.selectedOrder = order; // Store the selected order
      this.showModal = true; // Show the modal
    },
    async updateOrderStatus() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }

        const response = await fetch(
          `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.selectedOrder._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order: { status: this.selectedOrder.status }, // Correct payload structure
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Order status updated successfully:", data);

        this.closeModal(); // Close the modal after successful update
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    },
    cancelStatusChange() {
      this.selectedOrder.status = this.previousStatus; // Revert to the previous status
      this.closeModal(); // Close the modal
    },
    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
      this.previousStatus = null;
    },
    showDeleteConfirmation(order) {
      this.selectedOrder = order; // Store the selected order for deletion
      this.showDeleteModal = true; // Show the delete confirmation modal
    },
    async deleteOrder() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }

        const response = await fetch(
          `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.selectedOrder._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        console.log("Order deleted successfully");

        // Remove the deleted order from the local state
        this.orders = this.orders.filter(
          (order) => order._id !== this.selectedOrder._id
        );
      } catch (error) {
        console.error("Failed to delete order:", error);
      } finally {
        this.closeDeleteModal(); // Close the delete confirmation modal
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedOrder = null;
    },
    viewOrder(orderId) {
      this.$router.push(`/order-details/${orderId}`);
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

/* Main container */
.orders-container {
  display: flex;
  height: 100vh;
  background-color: black;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.delete-button {
  background: none;
  color: red;
  border: none;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.delete-button:hover {
  color: darkred;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #64f244;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.sidebar-header .logo {
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.nav-link {
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  color: black;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.sidebar-footer {
  text-align: left;
  margin-top: auto;
  padding: 1rem 0;
}

.logout-button {
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  color: black;
  background: none;
  border: none;
  transition: color 0.3s;
  justify-self: center;
}

.logout-button:hover {
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: black;
  overflow-y: auto;
}

.main-header {
  margin-bottom: 2rem;
}

.main-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  color: white;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #444;
}

.orders-table th {
  background-color: #222;
  color: white;
}

.orders-table tbody tr:hover {
  background-color: #333;
}

/* Status Styles */
.status-dropdown {
  background-color: #222;
  color: white;
  border: 2px solid #444; /* Default border color */
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1rem;
}

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

/* Modal Styles */
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
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
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
</style>
