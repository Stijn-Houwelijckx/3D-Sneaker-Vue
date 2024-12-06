<template>
  <div class="order-details-container">
    <h1 class="header">Order Details</h1>

    <div v-if="order" class="order-details-content">
      <!-- Order Summary Component -->
      <OrderSummary
        :orderId="order._id"
        :orderDate="formattedDate"
        :currentStatus="tempStatus"
        @status-change="showStatusConfirmation"
        @set-previous-status="setPreviousStatus"
      />

      <!-- Customer Information Component -->
      <CustomerInfo
        :name="order.user.name"
        :email="order.user.email"
        :address="order.user.address"
      />

      <!-- Sneaker Details Component -->
      <SneakerDetails :parts="order.sneaker.parts" />

      <!-- Order Actions Component -->
      <OrderActions @delete="showDeleteConfirmation" />
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
    <ConfirmationModal
      v-if="showModal"
      :title="isDeleting ? 'Confirm Delete Order' : 'Confirm Status Change'"
      :message="isDeleting
        ? `Are you sure you want to delete Order ID '${order._id}'? This action cannot be undone.`
        : `Are you sure you want to change the status of Order ID '${order._id}' to '${tempStatus}'?`"
      @confirm="isDeleting ? confirmDeleteOrder() : confirmStatusChange()"
      @cancel="cancelStatusChange"
    />
  </div>
</template>

<script>
import OrderSummary from "../components/OrderSummary.vue";
import CustomerInfo from "../components/CustomerInfo.vue";
import SneakerDetails from "../components/SneakerDetails.vue";
import OrderActions from "../components/OrderActions.vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";

export default {
  name: "OrderDetails",
  components: {
    OrderSummary,
    CustomerInfo,
    SneakerDetails,
    OrderActions,
    ConfirmationModal,
  },
  data() {
    return {
      order: null,
      tempStatus: null, // Temporary status before confirmation
      previousStatus: null, // Store the previous status before changes
      showModal: false,
      isDeleting: false, // Track whether the modal is for deleting
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
    setPreviousStatus() {
      this.previousStatus = this.order.status; // Save the current status
    },
    showStatusConfirmation(newStatus) {
      this.setPreviousStatus(); // Backup the original status
      this.tempStatus = newStatus; // Set the new temporary status
      this.showModal = true; // Open the modal
      this.isDeleting = false; // Ensure it's not delete mode
    },
    showDeleteConfirmation() {
      this.showModal = true;
      this.isDeleting = true; // Set delete mode
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
              order: { status: this.tempStatus },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Order status updated successfully:", data);

        // Update the actual status in the order object after confirmation
        this.order.status = this.tempStatus;
        this.closeModal();
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    },
    cancelStatusChange() {
      // Refresh the page to revert all changes
      window.location.reload();
    },
    async confirmDeleteOrder() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }

        const response = await fetch(
          `https://threed-sneaker-nodejs.onrender.com/api/v1/orders/${this.order._id}`,
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
        this.$router.push("/orders"); // Redirect to orders list
      } catch (error) {
        console.error("Failed to delete order:", error);
      } finally {
        this.closeModal();
      }
    },
    closeModal() {
      this.showModal = false;
      this.isDeleting = false;
    },
  },
  async mounted() {
    const orderId = this.$route.params.id; // Get the order ID from the route parameters
    const token = localStorage.getItem("token");

    if (!token) {
      this.error = "Unauthorized: No token found.";
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

.order-details-container {
  padding: 2rem;
  color: white;
  background-color: black;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  font-size: 2rem;
  font-weight: bold;
  color: #64f244;
  margin-bottom: 2rem;
}

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
