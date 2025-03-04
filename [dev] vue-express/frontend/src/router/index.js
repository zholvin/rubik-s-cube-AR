import { createRouter, createWebHistory } from 'vue-router'
import junjiehome from '../views/01-homepage/junjiehome.vue'
import vrDev from '../views/02-in-progress/vr-dev.vue'
import aframeTemplate from '../views/02-in-progress/aframe-template.vue'


const routes = [
  {
    path: '/', // 首页路径
    name: 'home',
    component: junjiehome, // 首页组件
  },
  {
    path: '/aframe-template',
    name: 'aframe-template',
    component: aframeTemplate,
  },
  {
    path: '/vr-dev',
    name: 'vr-dev',
    component: vrDev,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 添加新配置的路由
})

export default router