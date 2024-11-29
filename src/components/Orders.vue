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
        <div class="logout-button">Log Out</div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="main-header">
        <h2>Orders</h2>
        <p>28 orders found</p>
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
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.customer }}</td>
              <td>
                <select
                  v-model="order.status"
                  class="status-dropdown"
                  :class="{
                    'border-pending': order.status === 'pending',
                    'border-shipped': order.status === 'shipped',
                    'border-completed': order.status === 'Completed',
                    'border-production': order.status === 'production',
                  }"
                >
                  <option value="pending">pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="production">In production</option>
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
      orders: [
        { id: "#1001", date: "01 Jan 2024", customer: "John Doe", status: "pending" },
        { id: "#1002", date: "02 Jan 2024", customer: "Jane Smith", status: "pending" },
        { id: "#1003", date: "03 Jan 2024", customer: "Michael Brown", status: "pending" },
        { id: "#1004", date: "04 Jan 2024", customer: "Susan White", status: "pending" },
      ],
    };
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

.status-dropdown.option {
  background-color: #222;
  color: white;
}

.border-shipped {
  border-color: orange;
}

.border-completed {
  border-color: green;
}



</style>
