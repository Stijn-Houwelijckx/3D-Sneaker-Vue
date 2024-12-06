<template>
    <section class="section">
      <h2 class="section-header">Sneaker Details</h2>
      <table class="sneaker-table">
        <thead>
          <tr>
            <th>Part Name</th>
            <th>Color</th>
            <th>Material</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="part in parts" :key="part.partName">
            <td>{{ part.partName }}</td>
            <td>{{ part.color }}</td>
            <td>{{ part.material }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
  
  <script>
  export default {
    name: "SneakerDetails",
    props: {
      parts: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 2rem;
  }
  
  .section-header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #64f244;
  }
  
  .sneaker-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  .sneaker-table th,
  .sneaker-table td {
    padding: 1rem;
    text-align: left;
    border: 1px solid #444;
  }
  
  .sneaker-table th {
    background-color: #222;
    color: white;
  }
  </style>
  