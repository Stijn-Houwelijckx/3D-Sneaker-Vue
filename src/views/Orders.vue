<template>
  <div class="orders-container">
    <SidePanel />

    <main class="main-content">
      <OrdersHeader
        title="Orders"
        :subtitle="`${orders.length} orders found`"
      />

      <OrderList
        :orders="orders"
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
      showModal: false,
      showDeleteModal: false,
      selectedOrder: null,
      previousStatus: null,
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
          status: order.status,
        }));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    setPreviousStatus(order) {
      this.previousStatus = order.status;
    },
    showConfirmationModal(order) {
      this.selectedOrder = order;
      this.showModal = true;
    },
    showDeleteConfirmation(order) {
      this.selectedOrder = order;
      this.showDeleteModal = true;
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
              order: { status: this.selectedOrder.status },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Order status updated successfully:", data);

        this.closeModal();
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    },
    cancelStatusChange() {
      this.selectedOrder.status = this.previousStatus;
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
      this.previousStatus = null;
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

        this.orders = this.orders.filter(
          (order) => order._id !== this.selectedOrder._id
        );
      } catch (error) {
        console.error("Failed to delete order:", error);
      } finally {
        this.closeDeleteModal();
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedOrder = null;
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
  font-family: 'Roboto', sans-serif;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: black;
  overflow-y: auto;
}
</style>
