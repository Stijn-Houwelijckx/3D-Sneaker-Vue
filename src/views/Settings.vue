<template>
    <div class="settings-container">
      <SidePanel />
  
      <main class="main-content">
        <div class="settings-card">
          <h1 class="settings-title">Settings</h1>
          <form @submit.prevent="handleChangePassword" class="settings-form">
            <div class="form-group">
              <input
                v-model="oldPassword"
                type="password"
                placeholder="Old Password"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <input
                v-model="newPassword"
                type="password"
                placeholder="New Password"
                required
                class="form-input"
              />
            </div>
            <button type="submit" class="settings-button">Change Password</button>
          </form>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import SidePanel from "../components/SidePanel.vue";
  
  export default {
    name: "Settings",
    components: {
      SidePanel,
    },
    data() {
      return {
        oldPassword: "",
        newPassword: "",
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
      async handleChangePassword() {
        const token = localStorage.getItem("token");
        if (!token) {
          this.errorMessage = "Unauthorized. Please log in again.";
          return;
        }
  
        const response = await fetch(
          "https://threed-sneaker-nodejs.onrender.com/api/v1/users/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            }),
          }
        );
  
        if (response.ok) {
          this.successMessage = "Password changed successfully!";
          this.errorMessage = "";
          this.oldPassword = "";
          this.newPassword = "";
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || "Failed to change password.";
          this.successMessage = "";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .settings-container {
    display: flex;
    height: 100vh;
    background-color: black;
    color: white;
    font-family: 'Roboto', sans-serif;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  
  .settings-card {
    width: 100%;
    max-width: 400px;
    padding: 3rem;
    text-align: center;
    background: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    border: none;
  }
  
  .settings-title {
    font-size: 2rem;
    color: white;
  }
  
  .settings-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .form-group {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .form-input {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border: 1px solid #444;
    background-color: #222;
    color: white;
    box-shadow: none;
    outline: none;
    transition: border-color 0.3s;
    border-radius: 0; /* Match login button style */
  }
  
  .form-input::placeholder {
    color: #888;
  }
  
  .form-input:focus {
    border-color: #64F244;
  }
  
  .settings-button {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    background-color: #64F244;
    color: black;
    font-size: 1.2rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 0; /* Match login button style */
  }
  
  .settings-button:hover {
    background-color: #ffffff;
  }
  
  .success-message {
    color: #64F244;
    margin-top: 1rem;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  </style>
  