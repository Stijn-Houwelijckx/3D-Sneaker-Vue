<script setup>
import { ref } from 'vue'


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
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
}

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.4rem;
  margin-bottom: 2rem;
  font-weight: 700;
  color: white;
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
  border: 1px solid #444;
  font-size: 1.2rem;
  background: #222;
  color: white;
  font-family: 'Roboto', sans-serif;
  transition: border-color 0.3s;
  text-align: left;
}

.form-input::placeholder {
  color: #888;
}

.form-input:focus {
  border-color: #64F244;
  outline: none;
}

.login-button {
  width: 100%;
  max-width: 300px;
  background-color: #64F244;
  color: black;
  padding: 1rem;
  border-radius: 0px;
  font-size: 1.3rem;
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
</style>
