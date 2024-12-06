<template>
    <section class="section">
      <h2 class="section-header">Customer Information</h2>
      <div class="info-row">
        <p><strong>Name:</strong> {{ name }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </div>
      <div class="info-row">
        <p>
          <strong>Address:</strong>
          {{ address.street }}, {{ address.houseNr }}, {{ address.zipcode }}, {{ address.city }}
        </p>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "CustomerInfo",
    props: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: Object,
        required: true,
        validator(value) {
          return (
            "street" in value &&
            "houseNr" in value &&
            "zipcode" in value &&
            "city" in value
          );
        },
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
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  </style>
  