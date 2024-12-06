<template>
  <div class="orders-table">
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" @change="toggleAll($event.target.checked)" /></th>
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
          <td>
            <input
              type="checkbox"
              :value="order._id"
              @change="toggleSelection(order._id)"
              :checked="selectedOrders.includes(order._id)"
            />
          </td>
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
</template>

<script>
export default {
  name: "OrderList",
  props: {
    orders: {
      type: Array,
      required: true,
    },
    selectedOrders: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggleSelection(orderId) {
      this.$emit("toggle-order-selection", orderId);
    },
    toggleAll(selectAll) {
      this.$emit("toggle-all-orders", selectAll);
    },
    setPreviousStatus(order) {
      this.$emit("set-previous-status", order);
    },
    showConfirmationModal(order) {
      this.$emit("show-confirmation-modal", order);
    },
    showDeleteConfirmation(order) {
      this.$emit("show-delete-confirmation", order);
    },
    viewOrder(orderId) {
      this.$emit("view-order", orderId);
    },
  },
};
</script>

<style scoped>
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

.status-dropdown {
  background-color: #222;
  color: white;
  border: 2px solid #444;
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

.delete-button {
  background: none;
  color: #ff0000;
  border: none;
  font-weight: 700;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin-left: 0.5rem;
  transition: color 0.2s ease-in-out;
}

.delete-button:hover {
  color: #cc0000;
}

.orders-table input[type="checkbox"] {
  cursor: pointer;
}
</style>
