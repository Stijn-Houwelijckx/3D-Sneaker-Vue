<template>
    <section class="section">
      <h2 class="section-header">Order Summary</h2>
      <div class="info-row">
        <p><strong>Order ID:</strong> {{ orderId }}</p>
        <p><strong>Order Date:</strong> {{ orderDate }}</p>
      </div>
      <div class="info-row">
        <div class="status-group">
          <p><strong>Status:</strong></p>
          <select
            v-model="tempStatus"
            class="status-dropdown"
            :class="statusClass(tempStatus)"
            @change="onStatusChange"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="In production">In Production</option>
          </select>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "OrderSummary",
    props: {
      orderId: {
        type: String,
        required: true,
      },
      orderDate: {
        type: String,
        required: true,
      },
      currentStatus: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        tempStatus: this.currentStatus,
      };
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
      onStatusChange() {
        this.$emit("status-change", this.tempStatus);
      },
    },
  };
  </script>
  
  <style scoped>
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
  </style>
  