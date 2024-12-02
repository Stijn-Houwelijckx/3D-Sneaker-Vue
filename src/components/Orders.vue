<template>
  <div class="orders-container">
    <!-- Sidebar -->
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

    <!-- Main Content -->
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
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order._id"
              @click="viewOrder(order._id)"
              class="order-row"
            >
              <td>{{ order._id }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.customer }}</td>
              <td>
                <select
                  v-model="order.status"
                  class="status-dropdown"
                  :class="{
                    'border-pending': order.status === 'Pending',
                    'border-shipped': order.status === 'Shipped',
                    'border-completed': order.status === 'Completed',
                    'border-production': order.status === 'Production',
                  }"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Production">In Production</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      orders: [], // Orders will be populated after fetching
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
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
              Authorization: `Bearer ${token}`, // Include the token here
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Transform the fetched orders into the required structure
        this.orders = data.data.orders.map((order) => ({
          _id: order._id,
          date: new Date(order.orderDate).toLocaleDateString(), // Format the date
          customer: order.user.name,
          status: order.status,
        }));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    viewOrder(orderId) {
      this.$router.push(`/order-details/${orderId}`);
    },
    logout() {
      localStorage.removeItem("token"); // Remove token on logout
      this.$router.push("/login"); // Redirect to login page
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
</style>
