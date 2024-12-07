<template>
  <div class="orders-container">
    <SidePanel />

    <main class="main-content">
      <OrdersHeader
        title="Orders"
        :subtitle="`${orders.length} orders found`"
      />

      <!-- Bulk Action Dropdown -->
      <div class="bulk-actions">
        <select
          v-model="bulkStatus"
          class="bulk-dropdown"
          :disabled="!selectedOrders.length"
        >
          <option value="" disabled selected>Change status for selected</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="In production">In Production</option>
        </select>
        <button
          class="apply-button"
          :disabled="!selectedOrders.length || !bulkStatus"
          @click="bulkUpdateStatus"
        >
          Apply
        </button>
      </div>

      <OrderList
        :orders="orders"
        :selected-orders="selectedOrders"
        @toggle-order-selection="toggleOrderSelection"
        @toggle-all-orders="toggleAllOrders"
        @set-previous-status="setPreviousStatus"
        @show-confirmation-modal="showConfirmationModal"
        @show-delete-confirmation="showDeleteConfirmation"
        @view-order="viewOrder"
      />

      <!-- Status Change Confirmation Modal -->
      <ConfirmationModal
        v-if="showModal"
        title="Confirm Status Change"
        :message="`Are you sure you want to change the status of Order ID '${selectedOrder._id}' to '${selectedOrder.status}'?`"
        @confirm="updateOrderStatus"
        @cancel="cancelStatusChange"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        v-if="showDeleteModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete Order ID '${selectedOrder._id}'?`"
        @confirm="deleteOrder"
        @cancel="closeDeleteModal"
      />
    </main>
  </div>
</template>

<script>
import SidePanel from "../components/SidePanel.vue";
import OrdersHeader from "../components/OrdersHeader.vue";
import OrderList from "../components/OrderList.vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";

export default {
  name: "Orders",
  components: {
    SidePanel,
    OrdersHeader,
    OrderList,
    ConfirmationModal,
  },
  data() {
    return {
      orders: [],
      selectedOrders: [],
      bulkStatus: "",
      showModal: false,
      showDeleteModal: false,
      selectedOrder: null,
      previousStatus: null,
    };
  },
  mounted() {
    this.initializePrimus();
    this.fetchOrders();
  },
  methods: {
    // Initialize Primus for real-time updates
    initializePrimus() {
      const primus = Primus.connect("http://localhost:3000", {
        reconnect: {
          max: Infinity,
          min: 500,
          retries: 10,
        },
      });

      primus.on("data", (json) => {
        if (json.action === "newOrder") {
          this.addNewOrder(json.data.data.order);
        }
      });
    },
    async fetchOrders() {
      const token = localStorage.getItem("token");
      if (!token) return;

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

      if (!response.ok) return;

      const data = await response.json();
      this.orders = data.data.orders
        .map((order) => ({
          _id: order._id,
          date: new Date(order.orderDate).toLocaleDateString(),
          customer: order.user.name,
          status: order.status,
        }))
        .reverse(); // Reverse to ensure the latest orders appear first
    },
    async updateOrderStatus() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.selectedOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order: { status: this.selectedOrder.status },
          }),
        }
      );

      if (!response.ok) return;

      this.fetchOrders();
      this.closeModal();
    },
    addNewOrder(newOrder) {
      console.log("New order received:");
      console.log(newOrder);

      this.orders = [
        {
          _id: newOrder._id,
          date: new Date(newOrder.orderDate).toLocaleDateString(),
          customer: newOrder.user.name,
          status: newOrder.status,
        },
        ...this.orders, // Prepend the new order
      ];
    },
    cancelStatusChange() {
      const orderIndex = this.orders.findIndex(
        (order) => order._id === this.selectedOrder._id
      );
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = this.previousStatus;
      }
      this.closeModal();
    },
    async bulkUpdateStatus() {
      const token = localStorage.getItem("token");
      if (!token) return;

      await Promise.all(
        this.selectedOrders.map((orderId) =>
          fetch(
            `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${orderId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order: { status: this.bulkStatus },
              }),
            }
          )
        )
      );

      this.fetchOrders();
      this.bulkStatus = "";
      this.selectedOrders = [];
    },
    toggleOrderSelection(orderId) {
      if (this.selectedOrders.includes(orderId)) {
        this.selectedOrders = this.selectedOrders.filter(
          (id) => id !== orderId
        );
      } else {
        this.selectedOrders.push(orderId);
      }
    },
    toggleAllOrders(selectAll) {
      if (selectAll) {
        this.selectedOrders = this.orders.map((order) => order._id);
      } else {
        this.selectedOrders = [];
      }
    },
    showDeleteConfirmation(order) {
      this.selectedOrder = order;
      this.showDeleteModal = true;
    },
    async deleteOrder() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.selectedOrder._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      this.orders = this.orders.filter(
        (order) => order._id !== this.selectedOrder._id
      );
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedOrder = null;
    },
    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
      this.previousStatus = null;
    },
    setPreviousStatus(order) {
      this.previousStatus = order.status;
    },
    showConfirmationModal(order) {
      this.selectedOrder = { ...order };
      this.showModal = true;
    },
    viewOrder(orderId) {
      this.$router.push(`/order-details/${orderId}`);
    },
  },
};
</script>

<style scoped>
.orders-container {
  display: flex;
  height: 100vh;
  background-color: black;
  color: white;
  font-family: "Roboto", sans-serif;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: black;
  overflow-y: auto;
}

.bulk-actions {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.bulk-dropdown {
  padding: 0.5rem;
  border: 2px solid #444;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #222;
  color: white;
}

.apply-button {
  background-color: #64f244;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

.apply-button:disabled,
.bulk-dropdown:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>
