<template>
    <div class="actions">
      <router-link to="/orders" class="button back-button">Back to Orders</router-link>
      <button class="delete-button" @click="onDelete">Delete Order</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrderActions",
    emits: ["delete"],
    methods: {
      onDelete() {
        this.$emit("delete");
      },
    },
  };
  </script>
  
  <style scoped>
  .actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 2rem;
  }
  
  .button {
    padding: 0.5rem 1rem;
    background-color: #64f244;
    color: black;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .button:hover {
    background-color: #555;
    color: white;
  }
  
  /* Delete Button */
  .delete-button {
    color: #ff0000; /* Bright red */
    font-weight: bold;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: color 0.2s ease-in-out;
    background: none; /* Clean, no background */
  }
  
  .delete-button:hover {
    color: #cc0000; /* Darker red on hover */
  }
  </style>
  