<template>
    <header class="main-header">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </header>
  </template>
  
  <script>
  export default {
    name: "OrdersHeader",
    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  /* Main Header */
  .main-header {
    margin-bottom: 2rem;
  }
  
  .main-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: white;
  }
  
  .main-header p {
    color: white;
  }
  </style>
  