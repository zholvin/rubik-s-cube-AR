<!-- src/views/Introduction.vue -->
<template>
  <div id="page-frame">
    <Header />
    <div class="main">
      <div id="home-content">
        <h1>Login</h1>
        <p>This is the Login Page.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/Header.vue';
</script>

<style scoped>

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(227deg, #165b9c 20.72%, #81bee4 78.01%);
  border-radius: 30px;
  width: fit-content; /* 设置为 fit-content */
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: clamp(40px, 5vw, 80px);
  font-family: "Gochi Hand", cursive;
  color: #32284a;
}

p {
  font-family: "Baloo 2";
  font-size: clamp(30px, 2vw, 40px);
  color: #32284a;
}
</style>