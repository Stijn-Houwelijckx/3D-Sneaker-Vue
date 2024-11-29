<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// State
const email = ref("");
const password = ref("");
const errorMessage = ref("");
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
      // Process the response
      const user = data.data.user.user;
      console.log("Login successful:", user);

      // Redirect to the orders page
      router.push("/orders");
    })
    .catch((error) => {
      console.error("Error:", error);
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
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="login-button">Log In</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as provided earlier */
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
  min-height: 100vh; /* Full viewport height */
  width: 100%; /* Full width */
  margin: 0;
  padding: 0;
  background-color: black; /* Match global background */
  color: white; /* Ensure text is white */
  font-family: 'Roboto', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px; /* Restrict maximum width */
  padding: 3rem;
  text-align: center;
  background: black; /* Match global background */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  border: none; /* Remove borders */
  box-shadow: none; /* Remove box shadows */
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

.form-input {
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  border: 1px solid #444; /* Dark gray border */
  font-size: 1rem; /* Adjust font size */
  background: #222; /* Dark background */
  color: white;
  font-family: 'Roboto', sans-serif;
  transition: border-color 0.3s;
  border-radius: 0px; /* Add slight rounding */
  box-shadow: none; /* Remove input shadow */
}

.form-input::placeholder {
  color: #888; /* Lighter placeholder */
}

.form-input:focus {
  border-color: #64F244; /* Green border on focus */
  outline: none;
}

.login-button {
  width: 100%;
  max-width: 300px;
  background-color: #64F244;
  color: black;
  padding: 1rem;
  border-radius: 0px; /* Slight rounding for consistency */
  font-size: 1.2rem; /* Font size adjustment */
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  box-shadow: none; /* Remove button shadow */
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
