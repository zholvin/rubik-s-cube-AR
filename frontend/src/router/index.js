// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/01-index/home.vue';
import DevHome from '@/views/01-index/dev-home.vue';
import VrDev from '@/views/03-in-progress/vr-dev.vue';
import AframeTemplate from '@/views/03-in-progress/aframe-template.vue';
import Introduction from '../views/02-nav/Introduction.vue';
import About from '../views/02-nav/About.vue';
import Signup from '../views/02-nav/Signup.vue';
import Login from '../views/02-nav/Login.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/aframe-template',
    name: 'aframe-template',
    component: AframeTemplate,
  },
  {
    path: '/vr-dev',
    name: 'vr-dev',
    component: VrDev,
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: Introduction,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/dev-home',
    name: 'dev-home',
    component: DevHome,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;