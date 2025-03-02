import './assets/main.css'	                // 导入全局的 CSS 文件，通常用于设置全局样式
import { createApp } from 'vue'	            // 从 Vue 中导入创建 Vue 应用的函数
import App from './App.vue'		            // 导入主应用组件，通常包含应用的根布局
import router from './router'	            // 导入 Vue Router 配置，用于管理页面路由

const app = createApp(App)		// 创建一个新的 Vue 应用实例，并将根组件传入

app.use(router)					            // 使用 Vue Router 插件，将路由配置应用到 Vue 实例
app.mount('#app')				// 将 Vue 应用挂载到页面上，`#app` 是根 HTML 元素的 id