<template>
    <div class="order-details-container">
      <h2 class="header">Order Details</h2>
  
     
      <div v-if="order">
        <div class="order-info">
          <p><strong>Order ID:</strong> {{ order._id }}</p>
          <p><strong>Order Date:</strong> {{ formattedDate }}</p>
        </div>
  
        <div class="customer-details">
          <h3 class="sub-header">Customer Details</h3>
          <p><strong>Name:</strong> {{ order.user.name }}</p>
          <p><strong>Email:</strong> {{ order.user.email }}</p>
          <p>
            <strong>Address:</strong>
            {{ order.user.address.street }},
            {{ order.user.address.houseNr }},
            {{ order.user.address.zipcode }},
            {{ order.user.address.city }}
          </p>
        </div>
  
        <div class="sneaker-details">
          <h3 class="sub-header">Sneaker Details</h3>
          <ul>
            <li v-for="part in order.sneaker.parts" :key="part.partName">
              <strong>{{ part.partName }}:</strong> {{ part.color }} ({{ part.material }})
            </li>
          </ul>
        </div>
  
        <div class="status-info">
          <p><strong>Status:</strong> {{ order.status }}</p>
        </div>
  
        <router-link to="/orders" class="back-link">Back to Orders</router-link>
      </div>
  
      
      <div v-else-if="loading" class="loading-container">
        <p class="loading-text">Loading order details...</p>
      </div>
  
      
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
    async mounted() {
      const orderId = this.$route.params.id;
  
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NzQ5YzNlNTllZmNhYjc5NTE1NjVmYjgiLCJlbWFpbCI6ImFkbWluQHN3ZWFyLmNvbSIsImlhdCI6MTczMjg4NzUyNn0.tAIHAuZttTkKLdmqwMRNEk_2p67hdIIW3vyM_pzRNTY"; // Replace with your actual token
  
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
  .order-details-container {
    padding: 2rem;
    color: white;
    background-color: black;
    font-family: 'Roboto', sans-serif;
    max-width: 800px;
    margin: 0 auto;
    border: 2px solid #64f244;
    border-radius: 8px;
  }
  
  .header {
    font-size: 2rem;
    font-weight: bold;
    color: #64f244;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .sub-header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #64f244;
  }
  
  p {
    margin: 0.5rem 0;
    line-height: 1.5;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin: 0.5rem 0;
  }
  
  .back-link {
    display: inline-block;
    margin-top: 2rem;
    color: #64f244;
    text-decoration: none;
    font-weight: bold;
    border: 2px solid #64f244;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .back-link:hover {
    background-color: #64f244;
    color: black;
  }
  
  .loading-container {
    text-align: center;
    padding: 2rem;
  }
  
  .loading-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: #64f244;
  }
  
  .error-container {
    text-align: center;
    padding: 2rem;
  }
  
  .error-text {
    color: red;
    font-size: 1.2rem;
    text-align: center;
  }
  </style>
  