<template>
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
  </template>
  
  <script>
  export default {
    name: "OrderList",
    props: {
      orders: {
        type: Array,
        required: true,
      },
    },
    methods: {
      setPreviousStatus(order) {
        this.$emit("set-previous-status", order); // Emit an event to parent
      },
      showConfirmationModal(order) {
        this.$emit("show-confirmation-modal", order); // Emit an event to parent
      },
      showDeleteConfirmation(order) {
        this.$emit("show-delete-confirmation", order); // Emit an event to parent
      },
      viewOrder(orderId) {
        this.$emit("view-order", orderId); // Emit an event to parent
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
  
  /* Delete Button */
  .delete-button {
    background: none;
    color: #ff0000; /* Bright red */
    border: none;
    font-weight: 700;
    font-size: 1.5rem; /* Slightly larger for clarity */
    font-family: Arial, sans-serif; /* Clean and minimal font */
    cursor: pointer;
    line-height: 1;
    padding: 0;
    margin-left: 0.5rem; /* Adds spacing between dropdown and "X" */
    transition: color 0.2s ease-in-out; /* Smooth color transition */
  }
  
  .delete-button:hover {
    color: #cc0000; /* Slightly darker red on hover */
  }
  </style>
  