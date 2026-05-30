import { createRouter, createWebHistory } from 'vue-router'
import SocketDemoView from '@/views/SocketDemoView.vue'
import ChatLayoutView from '@/views/ChatLayoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'wechat-layout',
      component: ChatLayoutView,
    },
    {
      path: '/socket-demo',
      name: 'socket-demo',
      component: SocketDemoView,
    },
  ],
})

export default router
