<template>
  <div>
    <a-scene>
      <a-assets>
        <a-asset-item id="cube" src="/models/RBsCubeWorldOriginCube.glb"></a-asset-item>
      </a-assets>
      <a-sky color="lightgreen"></a-sky>
      <a-camera position="0 5 13"></a-camera>

      <a-entity class="RBsCube">
        <!-- Center pieces -->
        <a-gltf-model src="#cube" class="cube center" position="0 0 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="0 -1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="0 1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="0 0 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="1 0 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="0 0 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube center" position="-1 0 0" cube-controller></a-gltf-model>

        <!-- Edge pieces -->
        <a-gltf-model src="#cube" class="cube edge" position="0 1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="1 1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="0 1 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="-1 1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="0 -1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="1 -1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="0 -1 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="-1 -1 0" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="-1 0 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="1 0 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="-1 0 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube edge" position="1 0 1" cube-controller></a-gltf-model>

        <!-- Corner pieces -->
        <a-gltf-model src="#cube" class="cube corner" position="1 1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="-1 1 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="1 1 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="-1 1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="1 -1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="1 -1 -1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="-1 -1 1" cube-controller></a-gltf-model>
        <a-gltf-model src="#cube" class="cube corner" position="-1 -1 -1" cube-controller></a-gltf-model>
      </a-entity>
    </a-scene>
  </div>
</template>
<script setup>
import 'aframe';  // 导入 A-Frame
import { onMounted, onBeforeUnmount } from 'vue';

// A-Frame 组件注册应放在这里
AFRAME.registerComponent('cube-controller', {
  schema: {
    speed: { type: 'number', default: 270 }
  },
  init: function () {
    this.isMoving = false;
    this.faceMoveActive = false;
    this.moveQueue = [];
    this.movePivot = null;
    this.moveAxis = null;
    this.totalAngle = 0;
    this.remainingAngle = 0;
  },
  handleFaceRotation: function(pivot, axis, angle) {
    if (this.isMoving) {
      this.moveQueue.push({ pivot: pivot.clone(), axis: axis.clone(), angle: angle });
      return;
    }
    this.startFaceRotation(pivot, axis, angle);
  },
  startFaceRotation: function(pivot, axis, angle) {
    this.faceMoveActive = true;
    this.movePivot = pivot.clone();
    this.moveAxis = axis.clone().normalize();
    this.totalAngle = THREE.MathUtils.degToRad(angle);
    this.remainingAngle = this.totalAngle;
    this.isMoving = true;
  },
  tick: function(_, deltaTime) {
    if (!this.faceMoveActive) return;
    const timeFactor = deltaTime / 1000;
    let step = THREE.MathUtils.degToRad(this.data.speed) * timeFactor;
    if (Math.abs(step) > Math.abs(this.remainingAngle)) {
      step = this.remainingAngle;
    } else {
      step = Math.sign(this.remainingAngle) * step;
    }
    let pos = this.el.object3D.position;
    pos.sub(this.movePivot);
    pos.applyAxisAngle(this.moveAxis, step);
    pos.add(this.movePivot);
    this.el.object3D.rotateOnWorldAxis(this.moveAxis, step);
    this.remainingAngle -= step;
    if (Math.abs(this.remainingAngle) < 0.001) {
      this.faceMoveActive = false;
      this.isMoving = false;
      if (this.moveQueue.length > 0) {
        const nextMove = this.moveQueue.shift();
        this.startFaceRotation(nextMove.pivot, nextMove.axis, nextMove.angle);
      }
    }
  }
});

// 监听键盘事件
const handleKeydown = (e) => {
  const key = e.key.toLowerCase();
  const validMoves = ['t', 'y', 'u', 'i', 'o', 'p'];
  if (!validMoves.includes(key)) return;

  let moveMultiplier;
  if (e.ctrlKey) {
    moveMultiplier = -2; // 半转 –180°
  } else if (e.shiftKey) {
    moveMultiplier = 1;  // 顺时针 +90°
  } else {
    moveMultiplier = -1; // 逆时针 –90°
  }
  const angle = moveMultiplier * 90;

  let pivot, axis, tolerance = 0.1;
  switch(key) {
    case 't':
      pivot = new THREE.Vector3(0, 0, 1);
      axis = new THREE.Vector3(0, 0, 1);
      break;
    case 'y':
      pivot = new THREE.Vector3(0, 0, -1);
      axis = new THREE.Vector3(0, 0, -1);
      break;
    case 'u':
      pivot = new THREE.Vector3(0, 1, 0);
      axis = new THREE.Vector3(0, 1, 0);
      break;
    case 'i':
      pivot = new THREE.Vector3(0, -1, 0);
      axis = new THREE.Vector3(0, -1, 0);
      break;
    case 'o':
      pivot = new THREE.Vector3(-1, 0, 0);
      axis = new THREE.Vector3(-1, 0, 0);
      break;
    case 'p':
      pivot = new THREE.Vector3(1, 0, 0);
      axis = new THREE.Vector3(1, 0, 0);
      break;
    default:
      return;
  }

  document.querySelectorAll('.cube').forEach(cube => {
    const obj = cube.object3D;
    let pos = obj.position;
    let belongs = false;
    switch(key) {
      case 't':
        belongs = Math.abs(pos.z - 1) < tolerance;
        break;
      case 'y':
        belongs = Math.abs(pos.z + 1) < tolerance;
        break;
      case 'u':
        belongs = Math.abs(pos.y - 1) < tolerance;
        break;
      case 'i':
        belongs = Math.abs(pos.y + 1) < tolerance;
        break;
      case 'o':
        belongs = Math.abs(pos.x + 1) < tolerance;
        break;
      case 'p':
        belongs = Math.abs(pos.x - 1) < tolerance;
        break;
    }
    if (belongs && cube.components && cube.components['cube-controller']) {
      cube.components['cube-controller'].handleFaceRotation(pivot, axis, angle);
    }
  });
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* 可根据需要在这里进行自定义样式 */
</style>