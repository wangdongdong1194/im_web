import { createRouter, createWebHistory } from 'vue-router'
import SocketDemoView from '@/views/SocketDemoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'socket-demo',
      component: SocketDemoView,
    },
  ],
})

export default router
