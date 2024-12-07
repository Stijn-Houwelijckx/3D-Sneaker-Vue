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
          <td>
            <div class="color-display">
              <span>{{ part.color }}</span>
              <div
                class="color-box"
                :style="{ backgroundColor: `#${part.color}` }"
              ></div>
            </div>
          </td>
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

.color-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #444; /* Add border for better visibility */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); /* Add shadow for polished look */
}
</style>
