<script setup>
import { ref, onMounted } from 'vue';

const message = ref('');

// 在页面加载时从 Express API 获取数据
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

<style scoped>
/* Ensure the footer is always at the bottom */
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Page content takes remaining space */
router-view {
  flex-grow: 1;
}

/* Footer styles */
footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
