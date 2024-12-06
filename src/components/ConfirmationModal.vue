<template>
    <div class="modal-overlay">
      <div class="modal">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="onConfirm">Confirm</button>
          <button class="cancel-button" @click="onCancel">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ConfirmationModal",
    props: {
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
    methods: {
      onConfirm() {
        this.$emit("confirm");
      },
      onCancel() {
        this.$emit("cancel");
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .modal {
    background-color: white;
    color: black;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    text-align: center;
  }
  
  .modal-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  
  .confirm-button {
    background-color: #64f244;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .cancel-button {
    background-color: #f24444;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .confirm-button:hover,
  .cancel-button:hover {
    opacity: 0.8;
  }
  </style>
  