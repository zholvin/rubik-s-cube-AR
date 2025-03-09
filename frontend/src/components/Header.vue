<!-- src/components/Header.vue -->
<template>
  <div class="topnav">
    <img src="/images/cube-icon.png" alt="logo" id="logo">
    <nav>
      <router-link to="/">HOME</router-link>
      <router-link to="/dev-home">DEV-HOME</router-link>
      <router-link to="/introduction">INTRODUCTION</router-link>
      <router-link to="/about">ABOUT US</router-link>
<!--      <router-link to="/signup">SIGN UP</router-link>-->
<!--      <router-link to="/login">LOGIN</router-link>-->
    </nav>
  </div>
</template>

<style scoped>
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 30px;
}

.topnav img#logo {
  height: 50px;
}

.topnav nav {
  display: flex;
  flex-wrap: wrap;
}

.topnav nav a {
  text-decoration: none;
  padding: 5px 10px;
  color: black;
  font-size: clamp(15px, 2vw, 48px);
  font-style: normal;
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  line-height: normal;
}

@media (max-width: 768px) {
  .topnav {
    flex-direction: column;
    align-items: center;
    padding: 15px 20px;
  }

  .topnav img#logo {
    height: 40px;
  }

  .topnav nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    text-align: center;
  }

  .topnav nav a {
    padding: 10px 0;
    font-size: clamp(15px, 4vw, 30px);
    width: 100%;
    text-align: center;
  }
}
</style>