<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
    <br>
    <footer>
      <p>Vue + Express</p>
      <p>Message from Express API: {{ message }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const message = ref('');

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080');
    if (res.ok) {
      message.value = await res.text();
    } else {
      message.value = 'Failed to load data from API';
    }
  } catch (error) {
    message.value = 'Error fetching data';
  }
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

router-view {
  flex-grow: 1;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>