<template>
  <div id="home-frame">


    <div class="topnav">
      <!-- 左侧 logo -->
      <img src="/images/cube-icon.png" alt="logo" id="logo">
      <!-- 右侧导航栏 -->
      <nav>
        <a href="#">HOME</a>
        <a href="#">INTRODUCTION</a>
        <a href="#">ABOUT US</a>
        <a href="#">SIGN UP</a>
        <a href="#">LOGIN</a>
      </nav>
    </div>


    <div class="main">
      <!-- Left is for img -->
      <img id="home-img" src="/images/junjiehome.png" />

      <!-- Right is for content -->
      <div id="home-content">
        <h1>Rubik's Cube</h1>
        <h2>With Augmented Reality</h2>
        <p>Very Short Introductions offer concise and original introductions,
          Very Short Introductions offer concise and original introductions,
          Very Short Introductions offer concise and original introductions,
          Very Short Introductions offer concise and original introductions
        </p>
        <p>Very Short Introductions offer concise and original introductions,
          Very Short Introductions offer concise and original introductions
        </p>

        <router-link to="/aframe-template">Aframe-template-Vue</router-link>
        <router-link to="/vr-dev">VR-Dev-Vue</router-link>
        <a href="/pages/02-in-progress/vr-dev.html">VR-Dev-Html</a>
        <a href="/pages/02-in-progress/ar-dev.html">AR-Dev-Html</a>
        <a href="/pages/02-in-progress/ar-init.html">AR-Dev-Html</a>
        <a href="/pages/01-homepage/Darrghhome.html">Darr-Home-Html</a>
      </div>
    </div>




  </div>
</template>

<script setup>
</script>

<style scoped>
@import "/styles/junjiehome.css";
</style>