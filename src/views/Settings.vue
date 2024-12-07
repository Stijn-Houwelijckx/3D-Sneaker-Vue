<template>
  <div class="settings-container">
    <SidePanel />

    <main class="main-content">
      <div class="settings-card">
        <h1 class="settings-title">Settings</h1>
        <form @submit.prevent="handleChangePassword" class="settings-form">
          <!-- Old Password Input -->
          <div class="form-group password-group">
            <input
              v-model="oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              placeholder="Old Password"
              required
              class="form-input"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showOldPassword = !showOldPassword"
            >
              👁️‍🗨️
            </button>
          </div>

          <!-- New Password Input -->
          <div class="form-group password-group">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="New Password"
              required
              class="form-input"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showNewPassword = !showNewPassword"
            >
              👁️‍🗨️
            </button>
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
      showOldPassword: false, // State to toggle old password visibility
      showNewPassword: false, // State to toggle new password visibility
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleChangePassword() {
      // Reset messages
      this.successMessage = "";
      this.errorMessage = "";

      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "Unauthorized. Please log in again.";
        return;
      }

      try {
        const response = await fetch(
          "https://threed-sneaker-nodejs.onrender.com/api/v1/users/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user: {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword,
              },
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          this.successMessage = data.message || "Password changed successfully!";
          this.errorMessage = "";
          this.oldPassword = "";
          this.newPassword = "";
        } else {
          if (data.error === "Password or username is incorrect") {
            this.errorMessage = "Old password is incorrect.";
          } else {
            this.errorMessage = data.message || "Failed to change password.";
          }
        }
      } catch (error) {
        this.errorMessage = "Something went wrong. Please try again later.";
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
  position: relative;
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
  border-radius: 0;
}

.form-input::placeholder {
  color: #888;
}

.form-input:focus {
  border-color: #64F244;
}

.password-group {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  outline: none;
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
  border-radius: 0;
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
