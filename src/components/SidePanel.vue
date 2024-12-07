<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/logo.png" alt="Logo" class="logo" />
      <div class="sidebar-links">
        <div class="nav-link" @click="navigateTo('/orders')">Orders</div>
        <div class="nav-link" @click="navigateTo('/settings')">Settings</div>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="logout-button" @click="logout">Log Out</div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SidePanel",
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
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

.nav-link:hover {
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
}

.logout-button:hover {
  color: white;
}
</style>
