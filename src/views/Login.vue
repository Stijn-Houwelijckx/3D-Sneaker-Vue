<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// State
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showPassword = ref(false); // State to toggle password visibility
const router = useRouter();

// Login Function using fetch
function handleLogin() {
  fetch("https://threed-sneaker-nodejs.onrender.com/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email.value,
        password: password.value,
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
      return response.json();
    })
    .then((data) => {
      const token = data.data.token; // Extract token from response
      if (token) {
        localStorage.setItem("token", token); // Save token to localStorage
      }

      // Redirect to the orders page
      router.push("/orders");
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <img src="/logo.png" alt="Logo" class="logo" />
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="form-input"
          />
        </div>
        <div class="form-group password-group">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            required
            class="form-input password-input"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            👁️‍🗨️
          </button>
        </div>
        <button type="submit" class="login-button">Log In</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Original styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.body {
  background-color: black;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: black;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.login-card {
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

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
}

.login-form {
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

.password-group {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #444;
  font-size: 1rem;
  background: #222;
  color: white;
  transition: border-color 0.3s;
  border-radius: 0;
}

.form-input::placeholder {
  color: #888;
}

.form-input:focus {
  border-color: #64F244;
  outline: none;
}

.password-input {
  padding-right: 3rem; /* Space for the eye icon */
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

.login-button {
  width: 100%;
  max-width: 300px;
  background-color: #64F244;
  color: black;
  padding: 1rem;
  border-radius: 0;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
}

.login-button:hover {
  background-color: #ffffff;
  color: black;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
