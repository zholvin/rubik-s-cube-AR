<template>
  <div>
    <!-- A-Frame 场景 -->
    <a-scene>
      <!-- 在场景中添加一个盒子 -->
      <a-box position="0 0 0" rotation="0 45 0" color="#4CC3D9"></a-box>
      <!-- 在场景中添加一个相机 -->
      <a-sky color="lightblue"></a-sky>
      <a-camera position="0 2 5.5"></a-camera>
    </a-scene>
  </div>
</template>

<script setup>
// 你可以在这里添加需要的逻辑代码，例如事件监听、状态管理等
import 'aframe';  // 导入 A-Frame
</script>

<style scoped>
/* 可根据需要在这里进行自定义样式 */
</style>